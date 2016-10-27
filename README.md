# smartsearch-demo

This repo contains a demonstrative web app for 
[smartsearch](https://github.com/rressi/smartsearch). 

It may look familiar because I have bootstrapped it from 
[here](https://github.com/angular/quickstart/blob/master/README.md).

This web app is based on the following technologies:
- main programming language is Typescript 2.0.
- main web framework is AngularJS 2.0.
- the web hub is 100% hosted by *smartsearch*'s tool called 
  *searchservce*; it provides static web hosting, search 
  feature and also serves content in the form of many small 
  JSON documents.


# Components

As usual for AngularJS applications most of the logic and layout of the
page is generated dynamically on client side. If we exclude the banner
we have in the top of the page describing the scope of this 
demonstrative tool, all the application is generated dynamically by one
single tag inside [index.html]:

```html
<my-app>Loading...</my-app>
```


## AppModule.

It is a component handling importation and initialization of 
prerequisites.

It owns one service provider, *SearchService*, a single component for
the dynamic part of the page trivially called *AppComponent* an one
*Pipe* called *safe* that is used to let AngularJS to connect with
websites other than this current one. We use it for Google maps.


## SearchService
 
It is a class that allows to easily connect with the *smartsearch*'s
component called *searchservice*.

The following methods are implemented:
- `search(query)`: it is an asynchronous method that takes a free text
  query and performs a search. It returns an array of postings each of 
  them representing the unique id of all the documents matching the 
  passed query.
- `docs(ids)`: it takes the document's *uuids* returned by method 
  `search` and returns relative JSON documents.
  
  
# Document, Result

Are two data structures (implemented as classes) hosting generic 
documents (*Document*) and the specific document used by our
application to show the list of results (*Result*).


# AppComponent

Implements the web page with a template and a set of methods that are
called by the HTML components to interact with the rest of the system.