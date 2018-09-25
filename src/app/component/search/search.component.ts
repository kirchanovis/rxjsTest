import { Component, OnInit } from '@angular/core';
import { Search } from '../../model/search';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
// import { of } from 'rxjs/observable/of';
// import { concat } from 'rxjs/operators';;
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchResult$: Observable<Search[]>;
  search: FormControl = new FormControl();

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.searchResult$: Observable<Search[]> = this.search.valueChanges
    .pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(query => this.searchService.getSearchResult(query))
    );
  }

}
