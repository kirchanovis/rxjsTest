import { Injectable } from '@angular/core';
import { Search } from '../../model/search';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable()
export class SearchService {

  resultSearch: Observable<Search[]>;

  constructor(private http: HttpClient) { }

  getSearchResult(query): Observable<Search[]> {
    return this.getResult()
    .pipe(
      map(obj => obj.filter(objc => objc.title.toUpperCase().indexOf(query.toUpperCase()) !== -1 || objc.description.toUpperCase().indexOf(query.toUpperCase()) !== -1 )),
    );
  }

  getResult(): Observable<Search[]> {
    return this.http.get<Search[]>('/assets/query.json');
  }

}
