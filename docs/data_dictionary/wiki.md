# Bolster Data Dictionary
## Table of Contents
- [Audit Records](#audit-records)
- [User Search Log](#user-search-log)

## Audit Records
_Recorded record changes around records of interest._

### Parking Lot
_No parking lot items..._

### Access Patterns
| Access Pattern   | Query                                                                                                      |
|------------------|------------------------------------------------------------------------------------------------------------|
| Get all data     | bolsters_db.query(PK__begins_with='USER#', SK__begins_with='AUDIT#', fields='PK,SK,D,G1,G2,G3', scan=True) |

### Redshift Table
bolsters.public.member_edge_audits

### Dictionary
| Attribute           | Description                                                                           | Example                                               | Sensitive/PII/Internal   | Notes/Limitations/Nuances                                 | Dynamo Type   | Aliases   | Tags   | Feature/Epic Origin   | Deprecated   |
|---------------------|---------------------------------------------------------------------------------------|-------------------------------------------------------|--------------------------|-----------------------------------------------------------|---------------|-----------|--------|-----------------------|--------------|
| PK                  |                                                                                       | USER#jimmydavis-ENGAGEMENT#01GVEF59ARVDFSG15NB5J479E2 | False                    | Resource PK & SK. If either key is constant it's omitted. | String        |           |        |                       | False        |
| SK                  | Constant 'AUDIT#' with the date time of the record's creation.                        | AUDIT#2023-03-13T22:22:56Z                            | False                    |                                                           | String        |           |        |                       | False        |
| D.beafff            |                                                                                       | ['D.slate']                                           | False                    |                                                           | List          |           |        |                       | False        |
| D.client_ip         | Modifier's IP                                                                         | ::1                                                   | False                    | ::1 is localhost                                          | String        |           |        |                       | False        |
| D.method            | Request's method                                                                      | PUT                                                   | False                    |                                                           | String        |           |        |                       | False        |
| D.new_image.D.slate |                                                                                       | 01HAW4F0S8650CP6HJJ3Q397B3                            | False                    |                                                           | String        |           |        |                       | False        |
| D.new_image.G1      | D.new_image shows all of the changes that were made during the request.               | ACTIVE#2023-03-13T22:22:56Z                           | False                    |                                                           | String        |           |        |                       | False        |
| D.old_image.G1      | D.old_image shows all of the previous attributes our resource had before the request. | PENDING#2023-03-13T22:21:34Z                          | False                    |                                                           | String        |           |        |                       | False        |
| G1                  | New status that was modified                                                          | ACTIVE                                                | False                    |                                                           | String        |           |        |                       | False        |
| G2                  | BID of the user modifying our resource.                                               | chrisclientpartner                                    | False                    |                                                           | String        |           |        |                       | False        |
| G3                  | Main resource we're modifying.                                                        | ENGAGEMENT#01GVKDGNJR029FK0F1MTRWW5ZG                 | False                    |                                                           | String        |           |        |                       | False        |
        
## User Search Log
_A log of searches that a partner, client or admin performs per session._

### Parking Lot
_No parking lot items..._

### Access Patterns
| Access Pattern                                                   | Query                                                                                 |
|------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| Get a record by PK and SK                                        | PK='USER#${user_bid}', SK='SEARCH_SESSION#{jwt_token_iat}', limit=1, fields='PK,SK,D' |
| Get all records associated with a user                           | PK='USER#${user_bid}', SK__begins_with='SEARCH_SESSION#', fields='PK,SK,D'            |
| Get all partner-generated search sessions                        | index='GSI1', scan=True, SK__begins_with='SEARCH_SESSION#', fields='PK,SK,D'          |
| Get all partner-generated search sessions for a specific partner | index='GSI1', SK__begins_with='SEARCH_SESSION#', G1={TAG#tagID}, fields='PK,SK,D'     |

### Redshift Table
bolsters.public.search_sessions

### Dictionary
| Attribute                          | Description                                                                              | Example                             | Sensitive/PII/Internal   | Notes/Limitations/Nuances                                        | Dynamo Type   | Aliases   | Tags   | Feature/Epic Origin   | Deprecated   |
|------------------------------------|------------------------------------------------------------------------------------------|-------------------------------------|--------------------------|------------------------------------------------------------------|---------------|-----------|--------|-----------------------|--------------|
| PK                                 | User who performed the search                                                            | USER#kangaliaadmin                  | False                    |                                                                  | String        |           |        |                       | False        |
| SK                                 | Datetime suffix comes from the 'issued at' (iat) UTC timestamp from the requester's JWT. | SEARCH_SESSION#2023-01-23T18:54:46Z | False                    | Used to represent a user's search 'session'                      | String        |           |        |                       | False        |
| D.dt                               | The timestamp when the search was performed                                              | 2023-01-23T21:20:21Z                | False                    |                                                                  | String        |           |        |                       | False        |
| D.filters.D.roles                  |                                                                                          | STAFF                               | False                    |                                                                  | String        |           |        |                       | False        |
| D.filters.Profile.worktype.keyword |                                                                                          | "Board Member"\|"Fractional"        | False                    |                                                                  | String        |           |        |                       | False        |
| D.numResults                       | The number of results returned based on the filters supplied to the search service       | 6                                   | False                    |                                                                  | Number        |           |        |                       | False        |
| Details.activeType                 | The user's current active type                                                           | partner                             | False                    |                                                                  | String        |           |        |                       | False        |
| Details.isAdmin                    |                                                                                          | True                                | False                    |                                                                  | Boolean       |           |        |                       | False        |
| Details.referrer                   | The URL path from the API request's `Referer` header.                                    | /admin/s/talent                     | False                    | Possible values are `/admin/s/talent` or `/app/s/talent`         | String        |           |        |                       | False        |
| Details.userTags                   | The list of all tags the user making the search request has.                             | ['kangalia-bb']                     | False                    | This is blank for admins.                                        | List          |           |        |                       | False        |
| G1                                 | Represents a partner's tag or the first tag from the list of client tags                 | TAG#kangalia-bb                     | False                    | This is blank for admins and empty if the user doesn't have tags | String        |           |        |                       | False        |
        