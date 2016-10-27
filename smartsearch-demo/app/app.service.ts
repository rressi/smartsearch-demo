// Add the RxJS Observable operators we need in this app.
import './rxjs-operators';

import { Injectable }                      from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable }                      from 'rxjs/Observable';
import { Subject }                         from 'rxjs/Subject';

import { Document }                        from './app.document';

@Injectable()
export class SearchService {

    cachedDocs: Document[] = [];

    constructor (private http: Http) {}

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
            /* FIXME: this doesn't work
            var subject = new Subject<Document[]>();
            subject.next(getDocs());
            subject.complete();
            return subject.asObservable();
            */
            missingIds = [ids[0]];
        }

        var onDocs = function(res: Response): Document[] {

            // Caches all the documents:
            for (let line of res.text().split("\n")) {
                if (line.length == 0) {
                    continue;
                }
                var document = new Document(JSON.parse(line));
                var uuid: number = document.data[uuidField];
                this_.cachedDocs[uuid] = document;
            }

            missingIds = uncachedDocs();
            if (missingIds.length > 0) {
                console.error("SearchService.docs: missing ids:", missingIds);
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
