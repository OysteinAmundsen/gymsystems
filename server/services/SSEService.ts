import { Container, Service } from 'typedi';

import * as Express from 'express';
import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Logger } from '../utils/Logger';

/**
 * Singleton class serving as SSE event handler
 */
export class SSEService {
  openConnections: Response[] = [];
  app: Express.Express;

  constructor(app: Express.Express) {
    this.app = app;
    this.app.use('/api/event', (req, res) => this.connect(req, res));

    // Register instance in DI container
    Container.set(SSEService, this);
  }

  /**
   * A Client connects and the response object is configured as a
   * long-lived connection
   *
   * @param req
   * @param res
   */
  connect(req: Request, res: Response): void {
    req.socket.setTimeout(Number.MAX_VALUE);

    // push this res object to our global variable
    this.openConnections.push(res);
    Logger.log.debug(`Client #${this.openConnections.length} connected!`);

    // The 'close' event is fired when a user closes their browser window.
    // Remove this client from our openConnections pool
    req.on('close', () => this.closeConnection(res));

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('\n');
    this.keepAlive(res);
  }

  private closeConnection(res: Response) {
    Logger.log.debug(`Client #${this.openConnections.length} disconnecting!`);
    const index = this.openConnections.findIndex(c => c === res);
    this.openConnections.splice(index, 1);
  }

  private keepAlive(res: Response) {
    setTimeout(() => {
      try {
        res.write('\n');
        this.keepAlive(res);
      } catch (ex) {
        Logger.log.debug(ex);
        this.closeConnection(res);
      }
    }, 30 * 1000);
  }

  /**
   * Server publishing an event
   *
   * @param message any string. Can be a stringified JSON object
   */
  publish(message: string) {
    Logger.log.debug(`Publishing ${message} to ${this.openConnections.length} clients!`);
    this.openConnections.forEach(res => {
      try {
        const d = new Date();
        res.write(`id: ${d.getMilliseconds()}\n`);
        res.write(`data:${message}\n\n`); // Note the extra newline
      } catch (ex) {
        Logger.log.debug(ex);
        this.closeConnection(res);
      }
    });
  }
}
