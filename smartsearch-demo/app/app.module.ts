import { NgModule }      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { FormsModule }   from "@angular/forms";
import { HttpModule, JsonpModule } from '@angular/http';

import { SafePipe }        from './app.safe';
import { AppComponent }  from './app.component';
import { SearchService }  from './app.search_service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule
    ],
    providers: [ SearchService ],
    declarations: [ SafePipe, AppComponent ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
