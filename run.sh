#!/bin/sh

function fail {
    echo "Failed!"
    exit 1
}

# "Actor 1": "Siddarth",
# "Actor 2": "Nithya Menon",
# "Actor 3": "Priya Anand",
# "Director": "Jayendra",
# "Distributor": null,
# "Fun Facts": null,
# "Locations": "Epic Roasthouse (399 Embarcadero)",
# "Production Company": "SPI Cinemas",
# "Release Year": "2011",
# "Title": "180",
# "Writer": "Umarji Anuradha, Jayendra, Aarthi Sriram, & Suba ",
# "created_at": 1457607751,
# "created_meta": "881420",
# "id": "6A3F0D32-B944-49C1-BD80-67D9795346B7",
# "meta": null,
# "position": 1,
# "sid": 1,
# "updated_at": 1457607751,
# "updated_meta": "881420",
# "uuid": 1
CONTENT_FIELDS="Actor 1,Actor 2,Actor 3,Distributor,Director,Fun Facts,"
CONTENT_FIELDS+="Locations,Production Company,Release Year,Title,Writer"

WEB_APP="$(pwd)/smartsearch-demo/"

echo "-----------------------------------------------------------------"
echo "Running smart-search demo"
smartsearch/searchservice \
    -d data/documents.json \
    -id uuid \
    -content "${CONTENT_FIELDS}" \
    -p 3000 \
    -app "${WEB_APP}" \
    || fail

echo "-----------------------------------------------------------------"
echo "Done."
