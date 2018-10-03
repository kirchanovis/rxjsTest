import { Injectable } from '@angular/core';
import { Search } from '../../model/search';
import { Url } from '../../model/url';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable()
export class SearchService {

  constructor(private http: HttpClient) { }

  getSearchResult(query): Observable<Search[]> {
    return this.http.get<Search[]>('/assets/query.json')
    .pipe(
      map(obj => obj.filter(objc => objc.title.toUpperCase().indexOf(query.toUpperCase()) !== -1 || objc.description.toUpperCase().indexOf(query.toUpperCase()) !== -1 )),
    );
  }

  getUrl(): Observable<Url[]> {
    return this.http.get<Url[]>('/assets/url.json');
  }

}
