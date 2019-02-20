import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { CommonService } from 'app/shared/services/common.service';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { QueryOptions, MutationOptions } from 'apollo-angular/types';

@Injectable({ providedIn: 'root' })
export class GraphService {
  constructor(private http: HttpClient, private apollo: Apollo) { }

  getData(queryStr: string): Observable<any> {
    return this.get(queryStr).pipe(map(res => res.data));
  }

  deleteData(type: string, id: number): Observable<any> {
    const query = `{ delete${type}(id:${id}) }`;
    return this.delete(query).pipe(map(res => res.data));
  }

  saveData(type: string, data: any, returnVal: string): Observable<any> {
    const query = `{ save${type} (input:${this.jsonToGql(data)}) ${returnVal}}`;
    return this.post(query).pipe(map(res => res.data));
  }

  get(query: string, options?: QueryOptions<any>): Observable<any> {
    // return this.http.get<any>(`/api/graph/?query=${CommonService.compressString(query)}`, options);
    return this.apollo.query<any>(Object.assign({ query: gql`${query}` }, options));
    // return this.apollo.watchQuery<any>(Object.assign({ query: gql`${query}` }, options)).valueChanges;
  }

  post(query: string, options?: MutationOptions<any, any>): Observable<any> {
    const queryStr = `mutation ${query}`;
    // return this.http.post<any>(`/api/graph`, Object.assign({ query: queryStr }, options));
    return this.apollo.mutate(Object.assign({ mutation: gql`${queryStr}` }, options))
      .pipe(map(res => {
        this.apollo.getClient().clearStore(); // Clear cache immediatelly after a save operation
        return res;
      }));
  }

  delete(query: string): Observable<any> {
    const queryStr = `mutation ${query}`;
    // return this.http.delete<any>(`/api/graph/?query=${CommonService.compressString(queryStr)}`);
    return this.apollo.mutate<any>({ mutation: gql`${queryStr}` })
      .pipe(map(res => {
        this.apollo.getClient().clearStore(); // Clear cache immediatelly after a delete operation
        return res;
      }));
  }

  jsonToGql(val: any): string {
    return Array.isArray(val) ? this.mapFromArray(val) : this.mapFromObject(val);
  }

  /**
   * GraphQL value parser
   */
  private mapFromObject(obj): string {
    return `{${Object.keys(obj).reduce((str, k) => {
      str += `${str.length ? ',\n' : ''}`;
      if (obj[k] == null) {
        return str += `${k}: null`;
      }


      else if (Array.isArray(obj[k])) {
        return str += `${k}: [${obj[k].reduce((s, i) => {
          s += s.length ? ',' : '';
          return i['id']
            ? s += i ? `{id: "${i['id']}"}` : ''  // Contains id, reduce to just id references
            : s += `${this.mapFromObject(i)}`;    // Something else, keep it
        }, '')}]`;
      }


      else if (obj[k] instanceof Date) {
        return str += `${k}: ${obj[k].getTime()}`;
      }


      else if (moment.isMoment(obj[k])) {
        const d = obj[k].toDate();
        return str += `${k}: ${d.getTime()}`;
      }


      else if (typeof obj[k] === 'object') {
        if (obj[k]['id']) { return str += `${k}Id: "${obj[k]['id']}"`; }
        return str += `${k}: ${this.mapFromObject(obj[k])}`;
      }


      // Default value
      return str += `${k}: ${typeof obj[k] === 'string' || k === 'id' ? `"${('' + obj[k]).replace(/\n/gm, '\\n')}"` : obj[k]}`;
    }, '')}}`;
  }

  private mapFromArray(arr): string {
    return `[${arr.map(a => this.mapFromObject(a))}]`;
  }
}
