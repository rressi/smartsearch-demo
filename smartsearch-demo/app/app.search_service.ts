// Add the RxJS Observable operators we need in this app.
import './rxjs-operators';

import { Injectable }                      from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable }                      from 'rxjs/Observable';

import { Document }                        from './app.document';

@Injectable()
export class SearchService {

    cachedDocs: Document[] = [];

    constructor (private http: Http) {}

    /**
     * Asynchronous method to search for documents matching the passed
     * string.
     *
     * @param query query to be passed to method `/search`.
     *
     * @returns it asynchronously returns uuids of found documents..
     */
    search(query: string): Observable<number[]> {

        var onSearch = function(res: Response): number[] {
            return res.json() || [];
        };

        let params: URLSearchParams = new URLSearchParams();
        params.set('q', query);
        let http_query = '/search?' + params.toString()
        return this.http.get(http_query)
            .map(onSearch)
            .catch(this.handleError);
    }

    /**
     * Asynchronous method to fetch documents with the uuid's returned
     * by method `search`.
     *
     * @param ids query to be passed to method `/docs`.
     *
     * @returns it asynchronously returns all requested documents.
     */
    docs(ids: number[], uuidField: string): Observable<Document[]> {

        var this_ = this;

        var uncachedDocs = function(): number[] {
            var result: number[] = [];
            for (var uuid of ids) {
                if (uuid in this_.cachedDocs) {
                    // console.log("SearchService.docs: already cached:", uuid);
                } else {
                    result.push(uuid);
                }
            }
            return result;
        };

        var getDocs = function(): Document[] {
            var result: Document[] = [];
            for (var uuid of ids) {
                if (uuid in this_.cachedDocs) {
                    result.push(this_.cachedDocs[uuid]);
                } else {
                    console.error("SearchService.docs: not found in cache:", uuid);
                }
            }
            return result;
        };

        var missingIds = uncachedDocs();
        // console.log("SearchService.docs: missing ids" + missingIds);
        if (missingIds.length == 0) {
            // We can skip any http request!
            return Observable.timer(0).map(_ => getDocs()).take(1);
        }

        var onDocs = function(res: Response): Document[] {

            // Caches all the documents:
            var numDocuments = 0
            for (let line of res.text().split("\n")) {
                if (line.length == 0) {
                    continue;
                }
                var document = new Document(JSON.parse(line));
                var uuid: number = document.data[uuidField];
                this_.cachedDocs[uuid] = document;
                numDocuments++;
            }

            missingIds = uncachedDocs();
            if (missingIds.length > 0) {
                console.error("SearchService.docs: missing ids:", missingIds);
            }

            console.log("SearchService.docs: " + numDocuments.toString()
                        + " documents fetched");
            for (var k of res.headers.keys()) {
                console.log("SearchService.docs: " + k + ": " + res.headers.get(k));
            }

            return getDocs();
        };

        let params: URLSearchParams = new URLSearchParams();
        params.set('ids', missingIds.join(' '));
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
