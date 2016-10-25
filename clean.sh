#!/bin/bash

function fail {
    echo "Failed!"
    exit 1
}

echo "-----------------------------------------------------------------"
echo "Cleaning smartsearch"
rm -rf smartsearch/ || fail

# echo "-----------------------------------------------------------------"
# echo "Cleaning quickstart"
# rm -rf quickstart || fail

echo "-----------------------------------------------------------------"
echo "Cleaning smartsearch-demo"
rm -rf smartsearch-demo/node_modules || fail
rm -f  smartsearch-demo/app/*.js     || fail
rm -f  smartsearch-demo/app/*.map    || fail

echo "-----------------------------------------------------------------"
echo "Cleaning data"
rm -f data/documents.json            || fail

echo "-----------------------------------------------------------------"
echo "Done."
