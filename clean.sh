#!/bin/sh

function fail {
    echo "Failed!"
    exit 1
}

echo "-----------------------------------------------------------------"
echo "Cleaning smartsearch"
rm -rf smartsearch/ || fail

echo "-----------------------------------------------------------------"
echo "Cleaning quickstart"
rm -rf quickstart || fail

echo "-----------------------------------------------------------------"
echo "Cleaning smartsearch-demo"
rm -rf smartsearch-demo/node_modules || fail

echo "-----------------------------------------------------------------"
echo "Done."
