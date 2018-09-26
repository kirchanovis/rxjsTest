import { Component, OnInit } from '@angular/core';
import { Search } from '../../model/search';
import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs/observable/of';
import { timer } from 'rxjs/observable/timer';
import { debounceTime, distinctUntilChanged, switchMap, map, retryWhen, delay } from 'rxjs/operators';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchResult$: Search[];
  countResult$: Number;
  search: FormControl = new FormControl();
  counter = 0;
  error = false;

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    const first = this.search.valueChanges;

    const second = first.pipe(
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

    second.subscribe(result => {
      this.searchResult$ = result;
      this.countResult$ = result.length;
    });
  }

}
