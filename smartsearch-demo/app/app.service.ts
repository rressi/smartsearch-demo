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

        let params: URLSearchParams = new URLSearchParams();
        params.set('q', query);
        /*
        if (limit >= 0) {
            params.set('l', limit.toString());
        }
        */

        let http_query = '/search?' + params.toString()
        // console.log("SearchService.search: " + http_query)

        return this.http.get(http_query)
            .map(this.extractPostings)
            .catch(this.handleError);
    }

    private extractPostings(res: Response): number[] {
        // console.log("SearchService.extractPostings: " + res.toString())
        var body = res.json();
        if (body == null) {
            return []
        }
        // console.log("SearchService.extractPostings: " + body.toString())

        return body
    }

    docs(ids: number[]): Observable<Document[]> {

        let params: URLSearchParams = new URLSearchParams();
        params.set('ids', ids.join(' '));
        let http_query = '/docs?' + params.toString();
        // console.log("SearchService.docs: " + http_query);

        return this.http.get(http_query)
            .map(this.extractDocuments)
            .catch(this.handleError);
    }

    private extractDocuments(res: Response): Document[] {

        // console.log("SearchService.extractDocuments: [" + res.text() + "]")
        // console.log("SearchService.extractDocuments: [" + res.ok + "]")
        // console.log("SearchService.extractDocuments: [" + res.status + "]")

        var documents: Document[] = [];
        for (let line of res.text().split("\n")) {
            if (line.length == 0) {
                continue
            }

            // console.log("SearchService.extractDocuments: [" + line + "]")
            let data = JSON.parse(line)
            // console.log("SearchService.extractDocuments: [" + data.toString() + "]")
            documents.push(new Document(data))
        }

        return documents
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
