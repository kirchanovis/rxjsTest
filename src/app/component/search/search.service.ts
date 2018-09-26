import { Injectable } from '@angular/core';
import { Search } from '../../model/search';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { map, windowCount, tap  } from 'rxjs/operators';


@Injectable()
export class SearchService {

  resultSearch: Observable<Search[]>;

  constructor(private http: HttpClient) { }

  getSearchResult(query: string): Observable<Search[]> {
    return this.getResult()
    .pipe(
      map(obj => obj.filter(obj => obj.title.toUpperCase().indexOf(query.toUpperCase()) !== -1 || obj.description.toUpperCase().indexOf(query.toUpperCase()) !== -1 )),
    );
  }

  getResult(): Observable<Search[]> {
    return this.http.get<Search[]>('/assets/query.json');
  }

}
