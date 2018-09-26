import { Component, OnInit } from '@angular/core';
import { Search } from '../../model/search';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { debounceTime, distinctUntilChanged, switchMap, map, retryWhen, delay, finalize, tap } from 'rxjs/operators';
import { SearchService } from './search.service';
import { orderBy } from 'lodash';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchResult: Search[];
/*   searchResult$: Observable<Search[]>; */
  result$: Observable<Search[]>;
  countResult: Number = 0;
  search: FormControl = new FormControl();
  counter = 0;
  error: Boolean = false;
  loading: Boolean = false;
  order: String = 'asc';

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    /* this.searchResult$ = this.search.valueChanges */
    this.result$ = this.search.valueChanges
    .pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      tap(() => {
        this.loading = true;
        this.counter ++;
      }),
      map((value) => {
        if (this.counter % 3 === 0) {
          this.error = true;
          throw value;
        }
        this.error = false;
        return value;
      }),
      switchMap(query => this.searchService.getSearchResult(query)
      .pipe(
        delay(500),
        finalize(() => {
          this.loading = false;
        }),
      )),
      retryWhen(errors =>
        errors.pipe(
          delay(300),
        )
      ),
    );

    this.result$.subscribe(result => {
      this.searchResult = result;
      this.countResult = result.length;
    });
  }

  sortClick(field) {
    this.order = (this.order === 'asc' ? 'desc' : 'asc');
    this.searchResult = orderBy(this.searchResult, [field] , [this.order]);
  }

}
