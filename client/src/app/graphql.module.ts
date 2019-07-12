import { NgModule } from '@angular/core';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { HttpBatchLinkModule, HttpBatchLink } from 'apollo-angular-link-http-batch';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';
import { OperationDefinitionNode } from 'graphql';
import { BrowserService } from './shared/browser.service';
import { TransferState, makeStateKey, BrowserModule } from '@angular/platform-browser';
import { ApolloClientOptions } from 'apollo-client';
import { HttpClientModule } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { prioritize, Context } from 'apollo-angular-link-http-common';

export const graphqlUri = '/api/graph'; // <-- add the URL of the GraphQL server here
export const graphqlSubUri = '/api/ws'

const STATE_KEY = makeStateKey<any>('apollo.state');

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    TransferHttpCacheModule,
    ApolloModule,
    HttpBatchLinkModule
  ],
  exports: [ApolloModule, HttpLinkModule]
})
export class GraphQLModule {
  cache: InMemoryCache = new InMemoryCache();
  config: ApolloClientOptions<any> = {
    cache: this.cache,
    ssrMode: true,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all'
      }
    }
  }

  constructor(apollo: Apollo, httpLink: HttpBatchLink, private readonly transferState: TransferState, ) {
    const stdLink = httpLink.create({
      uri: graphqlUri,
      includeExtensions: true,
      batchInterval: 200,
      batchKey: (operation) => {
        // Default implementation disregarding headers
        const context: Context & { skipBatching?: boolean } = operation.getContext();

        if (context.skipBatching) {
          return Math.random().toString(36).substr(2, 9);
        }

        const opts = JSON.stringify({
          includeQuery: context.includeQuery,
          includeExtensions: context.includeExtensions,
        });

        return prioritize(context.uri, graphqlUri) + opts;
      }
    });

    const isBrowser = this.transferState.hasKey<any>(STATE_KEY);
    if (isBrowser) {
      // Process 'extension' commands passed to the operation.
      // These are added to the http headers in our interceptor.
      const headerLink = new ApolloLink((operation, forward) => {
        const headers = operation.getContext().headers;
        if (headers) { operation.extensions = headers; }
        return forward(operation);
      });

      // Create the websocket for subscriptions
      // This replaces ServerSentEvents as biderctional comm
      const wsProtocol = BrowserService.location().protocol.replace('http', 'ws');
      const wsClient = new WebSocketLink({
        uri: `${wsProtocol}//${BrowserService.location().host}${graphqlSubUri}`, // Should be able to run on same endpoint
        options: {
          reconnect: true,
        },
      });

      // Split the connection up based on type of comm
      // If query or mutation, use http. If subscription, use ws.
      const link = split(
        ({ query }) => {
          const { kind, operation } = <OperationDefinitionNode>getMainDefinition(query);
          return kind === 'OperationDefinition' && operation === 'subscription';
        },
        wsClient,
        headerLink.concat(stdLink)
      );
      const config = Object.assign({ link: link }, this.config);
      apollo.create(config);
      this.onBrowser();
    } else {
      const config = Object.assign({ link: stdLink }, this.config);
      apollo.create(config);
      this.onServer();
    }
  }

  onServer() {
    this.transferState.onSerialize(STATE_KEY, () => {
      return this.cache.extract();
    });
  }

  onBrowser() {
    const state = this.transferState.get<any>(STATE_KEY, null);

    this.cache.restore(state);
  }
}
