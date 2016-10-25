import {Component, OnInit, OnChanges, Input} from '@angular/core';

import {Document}        from './app.document';
import {Result}          from './app.result';
import {SearchService}   from './app.service';
import {URLSearchParams} from "@angular/http";

@Component({
    selector: 'my-app',
    template: `
    <table>
    <tr><td style="vertical-align: top">
        
    <div class="search-form">
      <table>
      
      <tr><th>Query</th>
      <td><input
        [(ngModel)]="query"
        (keyup)="onSearch()"
        placeholder="search here"></td>
      </tr>
      
      <tr><th>Total results</th>
      <td><input
        [(ngModel)]="numResults"
        readonly="true"></td>
      </tr>
      </table>
      
    </div>

    <div class="items">
        <li
            *ngFor="let result of results"
            (click)="selectResult(result.uuid)">
            <div><b>{{result.location}}</b></div>
            <br>
            <table>
                <tr><th>Title</th><td>{{result.title}}</td></tr>
                <tr><th>Year</th><td>{{result.releaseYear}}</td></tr>
                <tr><th>Director</th><td>{{result.director}}</td></tr>
                <tr><th>Actors</th><td>{{result.actors.join(', ')}}</td></tr>
                <tr><th>Writer</th><td>{{result.writer}}</td></tr>
                <tr><th>Distributor</th><td>{{result.distributor}}</td></tr>
                <tr><th>Producer</th><td>{{result.productionCompany}}</td></tr>
            </table>
        </li>
    </div>
   
    </td>
    <td style="vertical-align: top" width="100%">
        <iframe class="map-view"
            [src]="mapQuery | safe" allowfullscreen>
        </iframe>
        <div class="fatcs-box">
            <div >
                <div><b>Fun facts</b></div>
                <div style="font-size: 80%">{{funFacts}}</div>
            </div>
        </div>
    </td></tr>
    </table>
`
})

export class AppComponent implements OnInit, OnChanges {

    query = "";
    results: Result[];
    resultsByUuid: { [id: number] : Result; };
    numResults: number;

    @Input() funFacts: string;
    // @Output() funFactsChange: EventEmitter<string> = new EventEmitter();

    @Input() mapQuery: string;
    // @Output() mapQueryChange: EventEmitter<string> = new EventEmitter();

errorMessage: string;

    public constructor(private searchService: SearchService) {
        console.log("AppComponent.constructor");
        this.mapQuery = this.makeMapQuery("");
        this.results = [];
        this.resultsByUuid = {}
    }

    public onSearch(): void {
        // console.log("AppComponent.onSearch");
        this.searchService.search(this.query)
            .subscribe(
                results => this.onPostings(results),
                error =>  this.errorMessage = <any>error);
    }

    public onPostings(postings: number[]): void {

        this.numResults = postings.length;
        if (postings.length == 0) {
            this.onDocuments([])
        }

        // console.log("AppComponent.onPostings:" + postings.toString());
        this.searchService.docs(postings)
            .subscribe(
                documents => this.onDocuments(documents),
                error =>  this.errorMessage = <any>error);
    }

    public onDocuments(documents: Document[]) {
        // console.log("AppComponent.onDocuments:" + documents.toString());

        while(this.results.length > 0) {
            this.results.pop()
        }
        for (var uuid in this.resultsByUuid) {
            delete this.resultsByUuid[uuid];
        }

        for (var document of documents) {
            var result = new Result(document.data);
            this.results.push(result);
            this.resultsByUuid[result.uuid] = result;
        }

        this.selectResult(0);
    }

    selectResult(uuid: number) {

        var result: Result;
        if (uuid > 0) {
            result = this.resultsByUuid[uuid];
        }

        if (result == null
            || result.location == null
            || result.location == "") {
            this.mapQuery = this.makeMapQuery("");
        } else {
            this.mapQuery = this.makeMapQuery(result.location);
        }

        if (result == null
            || result.funFacts == null
            || result.funFacts == "") {
            this.funFacts = "None known"
        } else {
            this.funFacts = result.funFacts;
        }
    }

    public makeMapQuery(query: string): string {
        let params: URLSearchParams = new URLSearchParams();
        params.set('key', "AIzaSyA2OF5dhIpaMbj6Xdv1P_iKg4WIHhaPUj0");
        params.set('q', query + " San Fancisco California USA");
        var http_query = "https://www.google.com/maps/embed/v1/place?" +
            params.toString();
        console.log("Map: " + http_query);
        return http_query
    }

    ngOnInit() {
        console.log("AppComponent.ngOnInit");
        this.onSearch();
    }

    ngOnChanges() {
        console.log("AppComponent.ngOnChanges");
    }
}
