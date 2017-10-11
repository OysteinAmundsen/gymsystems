import { GymServer } from '../';
import { Container, Service } from 'typedi';

import { Express, Request, Response } from 'express';
import { EventEmitter } from 'events';
import { PassThrough } from 'stream';

import { Log } from '../utils/Logger';
import { OkResponse } from '../utils/OkResponse';
const dispatcher = new EventEmitter();

/**
 * Singleton class serving as SSE event handler
 */
@Service()
export class SSEController {
  app: Express;

  constructor() {
    this.app = Container.get(GymServer).app; // My ExpressJS app object

    // Register the route this middleware should respond to
    this.app.use('/api/event', (req, res) => this.connect(req, res));

    // Register this class with the TypeDI engine, so we can hook up to the `publish` method here from
    // other places in our application.
    Container.set(SSEController, this);
  }

  /**
   * Server publishing an event
   *
   * @param message any string. Can be a stringified JSON object
   */
  public publish(message: string) {
    Log.log.debug(`SSE Publishing ${message} to ${dispatcher.listenerCount('message')} clients!`);
    dispatcher.emit('message', message);
    return new OkResponse();
  }

  /**
   * A Client connects and the response object is configured as a
   * long-lived connection
   *
   * @param req
   * @param res
   */
  public connect(req: Request, res: Response): void {
    req.socket.setTimeout(Number.MAX_VALUE);

    // Create the event stream
    const stream = new PassThrough();
    stream.pipe(res);

    // A handler function called each time something is to be published to our clients
    const handler = (data: any, event: any) => {
      if (event) {
        Log.log.debug(`SSE Event received: ${event}`);
        stream.write(`event: ${event}\n`);
      }
      Log.log.debug(`SSE Data published: ${JSON.stringify(data)}`);
      stream.write(`data: ${JSON.stringify(data)}\n\n`);
    }

    // Register the handler on our dispatcher
    dispatcher.on('message', handler);
    Log.log.debug(`Client #${dispatcher.listenerCount('message')} connected!`);

    // The 'close' event is fired when a user closes their browser window.
    // Remove this client from our openConnections pool
    req.on('close', (err?: any) => this.closeConnection(handler, err));
    req.on('finish', (err?: any) => this.closeConnection(handler, err));
    req.on('error', (err?: any) => this.closeConnection(handler, err));

    // Return the response via our stream
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    stream.write(': open stream\n\n');
    this.keepAlive(stream);
  }

  /**
   * If we do not write to this stream once every variable 30sek - 2 minute intervals,
   * this connection will be terminated.
   *
   * @param stream the stream to keep alive
   */
  private keepAlive(stream: PassThrough) {
    setTimeout(() => {
      try {
        stream.write('\n');
        this.keepAlive(stream);
      } catch (ex) {
        Log.log.debug(ex);
        this.closeConnection(stream);
      }
    }, 30 * 1000);
  }

  /**
   * Close the connection to one client
   * This is usually called as an event handler for one of three event states on the
   * request object: `close`, `finish` or `error`
   *
   * @param handler The client handler to close
   * @param err optionally an error object if the stream closes through an exception
   */
  private closeConnection(handler: any, err?: any) {
    if (err) { Log.log.error(err); }

    Log.log.debug(`SSE Client #${dispatcher.listenerCount('message')} disconnecting!`);
    dispatcher.removeListener('message', handler);
  }
}
