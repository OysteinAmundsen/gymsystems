import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  constructor(private http: HttpClient) { }

  getData(queryStr: string): Observable<any> {
    return this.http
      .get<any>(`/api/graph/?query=${queryStr.replace(/#.+| +?|\r?\n|\r/gm, '')}`)
      .pipe(map(res => res.data));
  }

  deleteData(type: string, id: number): Observable<any> {
    return this.http.delete<any>(`/api/graph`, {
      params: { query: `delete${type}(id:${id})` }
    });
  }

  saveData(type: string, data: any, returnVal: string): Observable<any> {
    return this.http
      .post<any>(`/api/graph`, {
        query: `save${type}{input:{${JSON.stringify(
          data
        )}}}{${returnVal.replace(/ +?|\r?\n|\r/g, '')}}`
      })
      .pipe(map(res => res.data));
  }
}
