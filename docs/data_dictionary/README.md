# Data Dictionary

This tool automates (some of) the data dictionary creation process. Running this tool creates a Data Dictionary Markdown file using JSON-formatted example data records and user generated documentation.

NOTE: <b>`wiki.md` is a read-only generated file that should not be manually edited.</b>

## Installation
- Install [pandas](https://pandas.pydata.org/)
- Install [tabluate](https://pypi.org/project/tabulate/)

## Create New Documentation

1. Create a new source file in `./src` by copying and renaming the `__TEMPLATE__.json` file (or use the `make source f=<my_filename>` command).
    1. Complete the `"__METADATA__"` section.
    2. Find a Dynamo record that accurately reflects the record type you want to document.
    3. Copy the JSON from the record and paste the contents inside of the `"__RECORD__"` section of the source file.
    4. Redact any PII or sensitive data from the example record (emails, phone numbers, names, urls, images, etc.)
1. Run `make wiki`
1. Open the updated source file and complete the `"__DOCUMENTATION__"` section for each dictionary key. If an attribute or variable is limited to specific values or a range of values, make sure to include the possible values in the documentation.
1. Run `make wiki` to update the data dictionary wiki with your documentation
1. View the `wiki.md` file to ensure the documentation is updated and formatted properly.
1. Commit the updated `wiki.md` and source file.

## Update/Reload Documentation

1. Update an existing source file in `./src`
    1. Update the `"__METADATA__"` section.
    2. (Optional) Find an updated Dynamo record that accurately reflects the current record you want to document.
    3. (Optional) Copy the JSON from the record and paste the contents inside of the `"__RECORD__"` section of the source file.
    4. Redact any PII or sensitive data from the example record (emails, phone numbers, names, urls, images, etc.)
1. Run `make wiki`
1. Open the updated source file and complete the `"__DOCUMENTATION__"` section for each dictionary key. If an attribute or variable is limited to specific values or a range of values, make sure to include the possible values in the documentation.
1. Run `make wiki` to update the data dictionary wiki with your documentation
1. View the `wiki.md` file to ensure the documentation is updated and formatted properly.
1. Commit the updated `wiki.md` and source file.

## View Documentation

1. View the `wiki.md` file to see the complete documentation
2. View a specific resource's documentation by finding the appropriate file in the `markdown` directory.

## NOTES

- Several files serve as a template, or are automatically updated/generated and should not be written to — these files include: `wiki.md`, `__TEMPLATE__.json` and everything inside of the `markdown` directory.

- Markdown syntax requires escaping certain characters and symbols — validate the rendered markdown to ensure you're not losing content.

- The `make wiki` command supports CLI arguments:
    - `make wiki r=true`
        - Replaces the documentation's `Example` value with the value from the `__RECORD__` dictionary. Also updates the `Dynamo Type` when the `Example` data type changes.
    - `make wiki f="account_client.json"`
        - create/update the wiki for a specific file

- Automatically deprecate a field and leave it in the dictionary as a stricken field by adding a "~~" suffix to the field's key within the `__RECORD__` dictionary.
