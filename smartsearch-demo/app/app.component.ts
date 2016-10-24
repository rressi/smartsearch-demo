import {Component, OnInit, OnChanges} from '@angular/core';

import {Document}      from './app.document';
import {SearchService} from './app.service';


@Component({
    selector: 'my-app',
    template: `
    <div>
      <label>Query: </label>
      <input
        [(ngModel)]="query"
        (keyup)="doSearch()"
        placeholder="search here">
    </div>
    <li *ngFor="let result of results">
        {{result.data["Title"]}}
    </li>`
})

export class AppComponent implements OnInit, OnChanges {

    query = "";
    results: Document[];
    errorMessage: string;

    public constructor(private searchService: SearchService) {
        console.log("AppComponent.constructor");
    }

    public doSearch(): void {
        console.log("AppComponent.doSearch");
        this.searchService.search(this.query)
            .subscribe(
                results => this.onPostings(results),
                error =>  this.errorMessage = <any>error);
    }

    public onPostings(postings: number[]): void {
        console.log("AppComponent.onPostings:" + postings.toString());
        this.searchService.docs(postings)
            .subscribe(
                documents => this.results = documents,
                error =>  this.errorMessage = <any>error);
    }

    ngOnInit() {
        console.log("AppComponent.ngOnInit");
        this.doSearch();
    }

    ngOnChanges() {
        console.log("AppComponent.ngOnChanges");
    }
}
