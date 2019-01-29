import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { HttpBatchLinkModule, HttpBatchLink } from 'apollo-angular-link-http-batch';

export const graphqlUri = '/api/graph'; // <-- add the URL of the GraphQL server here

export function createApollo(httpLink: HttpBatchLink) {
  const link = httpLink.create({ uri: graphqlUri, includeExtensions: true });

  // Process 'extension' commands passed to the operation.
  // These are added to the http headers in our interceptor.
  const headerLink = new ApolloLink((operation, forward) => {
    const headers = operation.getContext().headers;
    if (headers) { operation.extensions = headers; }
    return forward(operation);
  });

  // Create the apollo client
  return {
    link: headerLink.concat(link),
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
