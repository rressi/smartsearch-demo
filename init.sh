#!/bin/sh

function fail {
    echo "Failed!"
    exit 1
}

echo "-----------------------------------------------------------------"
echo "Fetching and initializing smartsearch"
rm -rf smartsearch/
git clone git@github.com:rressi/smartsearch.git   || fail
( cd smartsearch && sh ./init.sh )                || fail

echo "-----------------------------------------------------------------"
echo "Initializing quickstart"
rm -rf quickstart/
git clone https://github.com/angular/quickstart.git || fail
(cd quickstart && npm install)                      || fail

echo "-----------------------------------------------------------------"
echo "Initializing smartsearch-demo"
rm -rf smartsearch-demo/node_modules                        || fail
cp -r quickstart/node_modules smartsearch-demo/node_modules || fail

echo "-----------------------------------------------------------------"
echo "Done."
