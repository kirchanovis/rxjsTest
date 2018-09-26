import { Component, OnInit } from '@angular/core';
import { Search } from '../../model/search';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, map, retryWhen, delay } from 'rxjs/operators';
import { SearchService } from './search.service';
import { orderBy } from 'lodash';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchResult: Search[];
  countResult: Number;
  search: FormControl = new FormControl();
  counter = 0;
  error: Boolean = false;
  order: String = 'asc';

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
      this.searchResult = result;
      this.countResult = result.length;
    });
  }

  sortClick(field) {
    this.order = (this.order === 'asc' ? 'desc' : 'asc');
    this.searchResult = orderBy(this.searchResult, [field] , [this.order]);
  }

}
