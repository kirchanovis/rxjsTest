import { Component, OnInit } from '@angular/core';
import { Search } from '../../model/search';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { debounceTime, distinctUntilChanged, switchMap, map, retryWhen, delay, finalize } from 'rxjs/operators';
import { SearchService } from './search.service';
import { orderBy } from 'lodash';
import {BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchResult: Search[];
  result$: Observable<Search[]>;
  countResult: Number = 0;
  search: FormControl = new FormControl();
  counter = 0;
  error: Boolean = false;
  loading: Boolean = false;
  order: String = 'asc';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.isLoading$.next(false);
    this.result$ = this.search.valueChanges
    .pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      map((value) => {
        this.counter ++;
        if (this.counter % 3 === 0) {
          this.error = true;
          throw value;
        }
        this.error = false;
        return value;
      }),
      switchMap(query => this.searchService.getSearchResult(query)),
      retryWhen(errors =>
        errors.pipe(
          delay(300)
        )
      )
    );

this.result$.subscribe(result => {
      this.searchResult = result;
      this.countResult = result.length;
    },
    error => {},
    () => {});
  }

  sortClick(field) {
    this.order = (this.order === 'asc' ? 'desc' : 'asc');
    this.searchResult = orderBy(this.searchResult, [field] , [this.order]);
  }

}
