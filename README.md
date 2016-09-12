# Dochero

Dochero is a lightweight API built in the Javascript language that serves as the backbone for a document management system.

Dochero allows and restricts access to documents stored using a permissions based,role based and access sharing framework.

The system abstracts its resources into the following:
* users
* documents
* roles

## HTTP VERBS & ENDPOINTS

### users

VERB | ENDPOINT
-----| --------
GET | /users
GET/PUT/POST | /users/:user_id

### documents

VERB | ENDPOINT
-----|----------
GET/POST | /documents
GET/PUT/DELETE | /documents/:document_id
GET | /users/:creator_id/documents
GET | /documents/date/:date/:limit
GET | /documents/limit/:limit
GET | /documents/acc/public
GET | /documents/search/:search_string
GET | /documents/role/:role/:limit
GET | /documents/share/:share
GET | documents/offset/:offset/:per_page
