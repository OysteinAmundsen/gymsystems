import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { HttpBatchLinkModule, HttpBatchLink } from 'apollo-angular-link-http-batch';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';
import { OperationDefinitionNode } from 'graphql';

export const graphqlUri = '/api/graph'; // <-- add the URL of the GraphQL server here
export const graphqlSubUri = '/api/ws'

export function createApollo(httpLink: HttpBatchLink) {
  const stdLink = httpLink.create({ uri: graphqlUri, includeExtensions: true });

  // Process 'extension' commands passed to the operation.
  // These are added to the http headers in our interceptor.
  const headerLink = new ApolloLink((operation, forward) => {
    const headers = operation.getContext().headers;
    if (headers) { operation.extensions = headers; }
    return forward(operation);
  });

  // Create the websocket for subscriptions
  // This replaces ServerSentEvents as biderctional comm
  const wsClient = new WebSocketLink({
    uri: `ws://localhost:3000${graphqlSubUri}`, // Should be able to run on same endpoint
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
  )

  // Create the apollo client
  return {
    link: link,
    cache: new InMemoryCache(/*{
      addTypename: false
    }*/),
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
  };
}

@NgModule({
  imports: [HttpBatchLinkModule],
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule { }
