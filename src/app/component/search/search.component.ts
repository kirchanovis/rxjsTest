import { Component, OnInit } from '@angular/core';
import { Search } from '../../model/search';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { debounceTime, distinctUntilChanged, switchMap, map, delay, finalize, tap, scan } from 'rxjs/operators';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchResult$: Observable<any>;
  result$: Observable<Search[]>;
  error$: Observable<Boolean>;
  search$: Observable<any>;
  search: FormControl = new FormControl();
  loading: Boolean = false;
  order: String = 'asc';
  field: String = 'id'

  constructor(private searchService: SearchService) {}

  ngOnInit() {

    this.search$ = this.search.valueChanges;

    this.error$ = this.search$
    .pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      scan((acc, _) => acc + 1, 0),
      map(val => (val % 3 === 0) ? true : false),
    );

    this.result$ = this.search$
    .pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      tap(() => {
        this.loading = true;
      }),
      switchMap(query => this.searchService.getSearchResult(query)
      .pipe(
        delay(500),
        finalize(() => {
          this.loading = false;
        }),
      ))
    );

    this.searchResult$ = combineLatest(
      this.result$,
      this.error$,
    ).pipe(
      map(value => value[1] ? { error: true, res: false} : { error: false, res: value[0]} )
    );
  }

  sortClick(field) {
    this.order = (this.order === 'asc' ? 'desc' : 'asc');
    this.field = field
  }

}
