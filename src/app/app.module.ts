import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



import { AppComponent } from './app.component';
import { SearchComponent } from './component/search/search.component';

import { SearchService } from './component/search/search.service';

import { OrderByPipe } from './component/search/order-by.pipe';


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    OrderByPipe
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    SearchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
