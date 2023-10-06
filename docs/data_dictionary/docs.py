import argparse
import glob
import json
import os
import re
from stat import S_IREAD, S_IRGRP, S_IROTH, S_IWGRP, S_IWOTH, S_IWUSR
from string import Template
from typing import Tuple

import pandas as pd
from boto3.dynamodb.types import TypeSerializer

DYNAMO_TYPES_MAP = {'S': "String",
                    'N': "Number",
                    'B': "Binary",
                    'SS': "String_Set",
                    'NS': "Number_Set",
                    'BS': "Binary_Set",
                    'NULL': "Null",
                    'BOOL': "Boolean",
                    'M': "Map",
                    'L': "List"}

dynamo_serializer = TypeSerializer()

parser = argparse.ArgumentParser()
parser.add_argument('-r', "--refresh", default='False')
parser.add_argument('-f', "--filename", default="")
args = parser.parse_args()

# determines if we should refresh the example and dynamo data type in the documentation
REFRESH_DOCUMENTATION = args.refresh.lower() == 'true'

# determines if we should update documentation for a specific file instead of all files
SOURCE_FILE = f"{args.filename.replace('.json', '')}.json" if args.filename else ""
print(args.filename)
print("🚀 ~ file: docs.py:36 ~ SOURCE_FILE:", SOURCE_FILE)

# required markdown table columns
BASE_TBL_COLS = {
    "Description": "",
    "Example": "",
    "Sensitive/PII/Internal": False,
    "Notes/Limitations/Nuances": "",
    "Dynamo Type": None,
    "Aliases": "",
    "Tags": "",
    "Feature/Epic Origin": "",
    "Deprecated": False,
}

STRING_TRUNCATE_LENGTH = 100


def get_flattened_dict_keys(
    d: dict = {},
    keys_acc: list = [],
    delimiter: str = ".",
    keys_only: bool = True,
    title_case: bool = False
) -> Tuple[list, dict]:
    """ return a flattened and delimited string representation of a dictionary's keys
    Args:
        d (dict, optional): the dictionary to flatt. Defaults to {}.
        keys_acc (list, optional): accumulates key strings while recursing through a dict tree path. Defaults to [].
        delimiter (str, optional): the symbol to join each delimited string key with. Defaults to ".".
            through multiple dict tree paths . Defaults to [].
        keys_only (bool, optional): determines whether to flatten only keys or both keys and value. Defaults to True.
        title_case (bool, optional): convert to title_case. Defaults to False.
    Returns:
        Tuple[list, dict]
            list: returns the delimited string key/(key&Value) collection. see the `delimited_str_keys` argument above
            dict: returns the delimited string key/(key&Value) collection. see the `delimited_str_keys` argument above
    """

    delimited_str = []
    delimited_dict = {}

    def flatten(d, keys_acc: list = keys_acc):

        if isinstance(d, dict):
            for k, v in d.items():
                flatten(d=v, keys_acc=[*keys_acc, k])

        elif isinstance(d, list) and len(d) and isinstance(d[0], dict):
            try:
                for k, v in d[0].items():
                    flatten(d=v, keys_acc=[*keys_acc, k])
            except BaseException:
                pass

        else:
            if not keys_only:
                keys_acc.append(str(d))

            delimited = delimiter.join(keys_acc)

            # strikethrough the delimited field key for a deprecated child field
            if delimited.endswith("~~"):
                delimited = f"~~{delimited}"

            delimited_str.append(delimited.title() if title_case else delimited)
            delimited_dict[delimited] = {**BASE_TBL_COLS, "Example": "", "Dynamo Type": ""}

            if isinstance(d, list):
                try:
                    delimited_dict[delimited]["Example"] = [d[0]] if len(d) > 1 else d
                except BaseException:
                    pass

            elif isinstance(d, str):
                # remove line breaks
                d = ' '.join(d.splitlines())

                # escape pipe-delimiter for markdown file
                d = d.replace("|", "\\|")

                # redact email addresses
                d = re.sub(r".+\@.+\..+", 'me@example.com', d)

                # redact phone
                if "phone" in delimited.lower():
                    d = "555-555-5555"

                # truncate long strings
                if len(d) > STRING_TRUNCATE_LENGTH:
                    d = f"{str(d)[:STRING_TRUNCATE_LENGTH]}..."

                delimited_dict[delimited]["Example"] = d
            else:
                delimited_dict[delimited]["Example"] = d

            # auto deprecate fields with "~~" prefix and suffix
            if delimited.startswith("~~") and delimited.endswith("~~"):
                delimited_dict[delimited]["Deprecated"] = True

            # convert the value's data type to a dynamo data type
            delimited_dict[delimited]["Dynamo Type"] = DYNAMO_TYPES_MAP.get(dynamo_serializer._get_dynamodb_type(d), "")

    flatten(d)
    return delimited_str, delimited_dict

print('Updating wiki file...1111111')
# Print current working directory
print(os.getcwd())
print('Updating wiki file...222222')
# List files in current directory
print(os.listdir())
print('Updating wiki file...333333')
# wiki_filepath = "./wiki.md"
wiki_filepath = 'docs/data_dictionary/wiki.md'
base_filepath = 'docs/data_dictionary'

if 'GITHUB_ACTIONS' in os.environ:
    print("Running in GitHub Actions")
    wiki_filepath = 'docs/data_dictionary/wiki.md'
else:
    print("Running locally")
    wiki_filepath = "./wiki.md"


print('Now Updating wiki file...')

# set Wiki file to write mode
os.chmod(path=wiki_filepath, mode=S_IWUSR|S_IWGRP|S_IWOTH)

print(sorted(glob.glob(f"./src/{SOURCE_FILE or '**/*.json'}", recursive=True)))
print(sorted(glob.glob(f"{base_filepath}/src/{SOURCE_FILE or '**/*.json'}", recursive=True)))
# print(sorted(glob.glob(f"./src/{SOURCE_FILE or '**/*.json'}", recursive=True)))

# create Table of Contents
with open(file=wiki_filepath, mode="w") as wiki_file:
    wiki_file.write("# Bolster Data Dictionary\n")
    wiki_file.write("## Table of Contents\n")

    # open original source for reading
    for f in sorted(glob.glob(f"./src/{SOURCE_FILE or '**/*.json'}", recursive=True)):
        if "__TEMPLATE__" in f:
            continue

        with open(f) as json_file:
            data = json.load(json_file)
            header = data.get("__METADATA__", {}).get("__HEADER__")

            if not header:
                continue

            # add chapters to Table of Contents
            # example: "- [Custom Data Record](#custom-data-record)"
            wiki_file.write(f"- [{header}](#{header.lower().replace(' ', '-')})\n")

    # load source JSON files
    for source_file_path in sorted(glob.glob(f"./src/{SOURCE_FILE or '**/*.json'}", recursive=True)):
        if "__TEMPLATE__" in source_file_path:
            continue

        print(f"Updating '{source_file_path}'")

# the template portion needs remain left-aligned to ensure proper formatting
        t = Template("""
## ${header}
_${description}_

### Parking Lot
${parking_lot}

### Access Patterns
${access_patterns}

### Redshift Table
${redshift_table}

### Dictionary
${dictionary}
        """)

        # open original source for reading
        with open(source_file_path, "r") as json_reader_file:
            data = json.load(json_reader_file)
            documentation = data.get("__DOCUMENTATION__", {})
            metadata = data.get("__METADATA__", {})

            # open original source for updating/writing
            with open(source_file_path, 'w') as json_writer_file:
                flattened_keys, flattened_keys_dict = get_flattened_dict_keys(d=data.get("__RECORD__"))

                if REFRESH_DOCUMENTATION:
                    for k, v in data.get("__DOCUMENTATION__").items():
                        # reset the documented example to the original record's value
                        v["Example"] = flattened_keys_dict.get(k, {}).get("Example")
                        v["Dynamo Type"] = DYNAMO_TYPES_MAP.get(
                            dynamo_serializer._get_dynamodb_type(
                                flattened_keys_dict.get(
                                    k, {}).get("Example")), "")

                # merge the flattened record structure with existing documentation
                data.update(__DOCUMENTATION__={**flattened_keys_dict, **documentation})

                # making a copy of the dict to avoid mutating the dictionary during keys() iteration
                for k in documentation.copy().keys():
                    # remove the documented key if the key is no longer in the example record
                    if k not in flattened_keys:
                        data["__DOCUMENTATION__"].pop(k, None)

                # update/add the documention section to the source file
                json_writer_file.write(json.dumps(data, indent=4))

                # create dictionary markdown
                dictionary_df = pd.DataFrame(documentation).T
                dictionary_df.index.name = 'Attribute'

                # create parking lot markdown
                parking_lot_df = pd.DataFrame(
                    metadata.get("__PARKING_LOT__"), columns=[
                        'Item', 'Author', ]).set_index('Item')
                parking_lot_markdown = parking_lot_df.to_markdown(tablefmt="github", headers="keys")

                # create access patterns markdown
                access_pattern_df = pd.DataFrame(
                    metadata.get("__ACCESS_PATTERNS__"), columns=[
                        'Access Pattern', 'Query']).set_index('Access Pattern')
                access_pattern_markdown = access_pattern_df.to_markdown(tablefmt="github", headers="keys")

                # create markdown for individual resource markdown
                dictionary_markdown = dictionary_df.to_markdown(tablefmt="github", headers="keys")
                filename = f"./markdown/{os.path.basename(source_file_path).replace('.json','')}.md"
                with open(filename, "w") as md_file:
                    md_file.write(dictionary_markdown)

        # add individual resource dictionary to wiki file
        wiki_file.write(
            t.safe_substitute(
                header=metadata.get("__HEADER__"),
                description=metadata.get("__DESCRIPTION__"),
                parking_lot=parking_lot_markdown if metadata.get("__PARKING_LOT__") else "_No parking lot items..._",
                access_patterns=access_pattern_markdown,
                redshift_table=metadata.get("__REDSHIFT_TABLE__"),
                dictionary=dictionary_markdown))

print('Finish Updating wiki file...')
# set Wiki file back to read only mode
os.chmod(path=wiki_filepath, mode=S_IREAD|S_IRGRP|S_IROTH)