#!/bin/bash

function fail {
    echo "Failed!"
    exit 1
}

echo "-----------------------------------------------------------------"
echo "Building smartsearch"
( cd smartsearch && sh ./build.sh ) || fail

echo "-----------------------------------------------------------------"
echo "Building smartsearch-demo"
( cd smartsearch-demo && tsc ) || fail

echo "-----------------------------------------------------------------"
echo "Building data"
rm -f data/documents.json            || fail
( cd data && python3 import_raw.py ) || fail

echo "-----------------------------------------------------------------"
echo "Done."
