#!/bin/sh

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
echo "Done."
