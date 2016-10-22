import { Component } from '@angular/core';

let message = ""

let CONTENT = `
<h1>smartsearch-demo</h1>

<div>
This is a demo app for <a href="https://github.com/rressi/smartsearch">smartsearch</a>.
Sources for this app can be found <a href="https://github.com/rressi/smartsearch-demo">here</a>.
<br><br>
<b>Note:</b> this app is still in the very first stages of development.
</div>

<br><br>
<hr>
<br><br>

<div ng-app="my-app" ng-controller="searchForm">
  <form novalidate>
    <b>Query:</b>
    <input type="text" ng-model="searchQuery">
    <button ng-click="">OK</button>
  </form>
</div>
<div>

<br><br>
Not implemented yet, sorry!
</div>
`

@Component({
    selector: 'my-app',
    template: CONTENT
})
export class AppComponent { }
