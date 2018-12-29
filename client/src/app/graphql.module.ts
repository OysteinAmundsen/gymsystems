import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { HttpBatchLinkModule, HttpBatchLink } from 'apollo-angular-link-http-batch';

export const graphqlUri = '/api/graph'; // <-- add the URL of the GraphQL server here

export function createApollo(httpLink: HttpBatchLink) {
  const link = httpLink.create({ uri: graphqlUri, includeExtensions: true });
  const headerLink = new ApolloLink((operation, forward) => {
    const headers = operation.getContext().headers;
    if (headers) { operation.extensions = headers; }
    return forward(operation);
  });
  return {
    link: headerLink.concat(link),
    cache: new InMemoryCache()
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
