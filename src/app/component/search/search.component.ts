import { Component, OnInit } from '@angular/core';
import { Search } from '../../model/search';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
// import { of } from 'rxjs/observable/of';
// import { concat } from 'rxjs/operators';;
import { debounceTime, distinctUntilChanged, switchMap, every } from 'rxjs/operators';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchResult$: Search[];
  search: FormControl = new FormControl();

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.search.valueChanges
    .pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(query => this.searchService.getSearchResult(query))
    ).subscribe(result => {
      console.log(result, '1')
      this.searchResult$ = result
    });
  }

}
