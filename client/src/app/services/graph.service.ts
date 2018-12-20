import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';

// import { Apollo } from 'apollo-angular';
// import gql from 'graphql-tag';

@Injectable({ providedIn: 'root' })
export class GraphService {
  constructor(private http: HttpClient/*, private apollo: Apollo*/) { }

  getData(queryStr: string): Observable<any> {
    return this.http.get<any>(`/api/graph/?query=${queryStr.replace(/#.+| +?|\r?\n|\r/gm, '')}`).pipe(map(res => res.data));
    // return this.apollo.query<any>({ query: gql`${queryStr}` }).pipe(map(res => res.data));
  }

  deleteData(type: string, id: number): Observable<any> {
    const query = `mutation { delete${type}(id:${id}) }`;
    return this.http.delete<any>(`/api/graph/?query=${query.replace(/#.+| +?|\r?\n|\r/gm, '')}`).pipe(map(res => res.data));
    // return this.apollo.mutate<any>(gql`${query}`).pipe(map(res => res.data));
  }

  saveData(type: string, data: any, returnVal: string): Observable<any> {
    const query = `mutation {save${type} (input:${this.jsonToGql(data)}) ${returnVal}}`;
    return this.http.post<any>(`/api/graph`, { query: query }).pipe(map(res => res.data));
    // return this.apollo.mutate(gql`${query}`).pipe(map(res => res.data));
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


      else if (obj[k] instanceof Date || moment.isMoment(obj[k])) {
        return str += `${k}: ${obj[k].getTime()}`;
      }


      else if (typeof obj[k] === 'object' && obj[k]['id']) {
        return str += `${k}Id: "${obj[k]['id']}"`;
        // return str += `${k}: {id: "${obj[k]['id']}"}`;
      }


      // Default value
      return str += `${k}: ${typeof obj[k] === 'string' || k === 'id' ? `"${obj[k].replace(/\n/gm, '\\n')}"` : obj[k]}`;
    }, '')}}`;
  }

  private mapFromArray(arr): string {
    return `[${arr.map(a => this.mapFromObject(a))}]`;
  }
}
