import {Component, OnInit, OnChanges, Input} from '@angular/core';

import {Document}        from './app.document';
import {Result}          from './app.result';
import {SearchService}   from './app.search_service';
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

/**
 * This is the main application's GUI component.
 */
export class AppComponent implements OnInit, OnChanges {

    // Properties:
    query = "";
    results: Result[];
    resultsByUuid: { [id: number] : Result; };
    numResults: number;
    @Input() funFacts: string;
    @Input() mapQuery: string;

errorMessage: string;

    public constructor(private searchService: SearchService) {
        // console.log("AppComponent.constructor");
        this.mapQuery = this.makeMapQuery("");
        this.results = [];
        this.resultsByUuid = {}
    }

    /**
     * It is called every time the user types a key on the search box.
     *
     * It performes a search in 2 steps:
     * - first let the backend doing the search with method /search
     * - then fetches matching documents using the result of the first
     *   query.
     */
    public onSearch(): void {
        // console.log("AppComponent.onSearch");

        var this_ = this;
        var onPostings = function(postings: number[]): void {
            this_.numResults = postings.length;
            if (postings.length == 0) {
                this_.setDocuments([]);
            } else {
                this_.searchService.docs(postings, 50, 'uuid')
                    .subscribe(
                        documents => this_.setDocuments(documents),
                        error =>  this_.errorMessage = <any>error);
            }
        };

        this.searchService.search(this.query)
            .subscribe(
                results => onPostings(results),
                error =>  this.errorMessage = <any>error);
    }

    /**
     * Given an array of document it generates results with them.
     */
    public setDocuments(documents: Document[]) {
        // console.log("AppComponent.onDocuments:" + documents.toString());

        // Clears current results:
        while(this.results.length > 0) {
            this.results.pop()
        }
        for (var uuid in this.resultsByUuid) {
            delete this.resultsByUuid[uuid];
        }

        // Generates results from the passed documents:
        for (var document of documents) {
            var result = new Result(document.data);
            this.results.push(result);
            this.resultsByUuid[result.uuid] = result;
        }

        // Un-selects results:
        this.selectResult(0);
    }

    /**
     * Given one unique identifier, selects releated domcument and
     * updates the map component in order to show the location put on
     * the selected result.
     */
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

    /**
     * Generates a query for GoogleMap.
     *
     * @param query
     * @returns {string}
     */
    public makeMapQuery(query: string): string {
        let params: URLSearchParams = new URLSearchParams();
        params.set('key', "AIzaSyA2OF5dhIpaMbj6Xdv1P_iKg4WIHhaPUj0");
        params.set('q', query + " San Fancisco California USA");
        var http_query = "https://www.google.com/maps/embed/v1/place?" +
            params.toString();
        // console.log("Map: " + http_query);
        return http_query
    }

    ngOnInit() {
        console.log("AppComponent.ngOnInit");
        this.searchService.pollCompression()
            .subscribe(
                results => this.onSearch(),
                error =>  this.errorMessage = <any>error);
    }

    ngOnChanges() {
        console.log("AppComponent.ngOnChanges");
    }
}
