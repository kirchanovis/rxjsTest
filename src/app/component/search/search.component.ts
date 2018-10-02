import { Component, OnInit } from '@angular/core';
import { Search } from '../../model/search';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { debounceTime, distinctUntilChanged, switchMap, map, retryWhen, delay, finalize, tap, bufferCount, scan, mergeMap } from 'rxjs/operators';
import { SearchService } from './search.service';
import { orderBy } from 'lodash';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchResult: Search[];
  searchResult$: Observable<any>;
  sortResult$: Observable<any>;
  result$: Observable<Search[]>;
  error$: Observable<Boolean>;
  search$: Observable<any>;
  search: FormControl = new FormControl();
  counter = 0;
  error: Boolean = false;
  loading: Boolean = false;
  order: String = 'asc';

  constructor(private searchService: SearchService) {}

  ngOnInit() {

    this.search$ = this.search.valueChanges;

    this.error$ = this.search$
    .pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      scan((acc, _) => acc + 1, 0),
      map(val => {
        if (val % 3 === 0) {
          val = 0;
          return true;
        } else {
          return false;
        }
      }),
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
      map(value =>  value[1] ? false : value[0] )
    );
  }

  sortClick(field) {
/*     this.order = (this.order === 'asc' ? 'desc' : 'asc');
    this.sortResult$ = this.searchResult$.pipe(
      mergeMap(value => orderBy(value, [field] , [this.order]) )
    ); */
  }

}
