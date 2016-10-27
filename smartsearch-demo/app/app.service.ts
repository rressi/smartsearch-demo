// Add the RxJS Observable operators we need in this app.
import './rxjs-operators';

import { Injectable }                      from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable }                      from 'rxjs/Observable';

import { Document }                        from './app.document';

@Injectable()
export class SearchService {

    constructor (private http: Http) {}

    search(query: string): Observable<number[]> {

        var onSearch = function(res: Response): number[] {
            return res.json() || [];
        }

        let params: URLSearchParams = new URLSearchParams();
        params.set('q', query);
        let http_query = '/search?' + params.toString()
        return this.http.get(http_query)
            .map(onSearch)
            .catch(this.handleError);
    }

    docs(ids: number[], uuid: string): Observable<Document[]> {

        var onDocs = function(res: Response): Document[] {
            var documents: Document[] = [];
            for (let line of res.text().split("\n")) {
                if (line.length == 0) {
                    continue;
                }
                var document = new Document(JSON.parse(line));
                documents.push(document);
            }
            return documents;
        };

        let params: URLSearchParams = new URLSearchParams();
        params.set('ids', ids.join(' '));
        let http_query = '/docs?' + params.toString();
        // console.log("SearchService.docs: " + http_query);

        return this.http.get(http_query)
            .map(onDocs)
            .catch(this.handleError);
    }

    private handleError (error: Response | any) {
        console.log("SearchService.handleError: " + error.toString())

        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
