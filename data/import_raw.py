import gzip
import json


def load_input(raw):
  column_names = [column['name']
                  for column in raw['meta']['view']['columns']]
  for item in raw['data']:
    yield {column_name: value
           for column_name, value in zip(column_names, item)}

def main(input_file, output_file):

  if input_file.endswith(".gz"):
    _open = gzip.open
  else:
    _open = open
  with _open(input_file, "rt",
             encoding='utf-8') as fd:
    raw = json.load(fd)

  uuid = 0
  if output_file.endswith(".gz"):
    _open = gzip.open
  else:
    _open = open
  with _open(output_file, "wt",
             encoding='utf-8') as fd:
    for item in load_input(raw):
      uuid += 1
      item['uuid'] = uuid
      fd.write(json.dumps(item,
                          sort_keys=True))
      fd.write("\n")

  print("{} documents imported".format(uuid))


if __name__ == "__main__":
  main("raw.json", "documents.json")
