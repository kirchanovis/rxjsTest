import { Injectable } from '@angular/core';
import { Search } from '../../model/search';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { find, map } from 'rxjs/operators';


@Injectable()
export class SearchService {

  resultSearch: Observable<Search[]>;

  constructor(private http: HttpClient) { }

  getSearchResult(query: string): Observable<Search[]> {
    return this.getResult()
    .pipe(
      find(obj => obj[0].title === query || obj[0].description === query)
    );
  }

  getResult(): Observable<Search[]> {
    return this.http.get<Search[]>('/assets/query.json');
  }

}
