"""
This file imports data from the original document to generate a consistent
text file made of a stream of JSON objects (each object is a dict at its
top-level).
"""

import gzip
import json


def load_input(raw):
    """Takes the original JSON data structure and generates a stream of
    data items as dictionaries made of key/value pairs."""
    column_names = [column['name']
                    for column in raw['meta']['view']['columns']]
    for item in raw['data']:
        yield {column_name: value
               for column_name, value in zip(column_names, item)}


def main(input_file, output_file):
    """It rakes an input file with the source data and converts it
    to a stream of JSON documents.
    """

    # The input file can be optionally encoded with gzip format:
    if input_file.endswith(".gz"):
        _open = gzip.open
    else:
        _open = open
    with _open(input_file, "rt",
               encoding='utf-8') as fd:
        raw = json.load(fd)  # Parses all the input file.

    # Also the output file can be optionally encoded with gzip format:
    uuid = 0
    if output_file.endswith(".gz"):
        _open = gzip.open
    else:
        _open = open
    with _open(output_file, "wt",
               encoding='utf-8') as fd:
        # for each element extracted from the input
        for item in load_input(raw):
            uuid += 1  # generates incremental uuid from 1
            item['uuid'] = uuid
            fd.write(json.dumps(item,
                                sort_keys=True))
            fd.write("\n")  # one encoded document per line

    print("{} documents imported".format(uuid))


if __name__ == "__main__":
    main("raw.json", "documents.json")
