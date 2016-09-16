# Dochero

[![Coverage Status](https://coveralls.io/repos/github/andela-emabishi/document-management-system/badge.svg?branch=dev)](https://coveralls.io/github/andela-emabishi/document-management-system?branch=dev) [![CircleCI](https://circleci.com/gh/andela-emabishi/document-management-system/tree/dev.svg?style=svg)](https://circleci.com/gh/andela-emabishi/document-management-system/tree/dev)

Dochero is a lightweight API built in the Javascript language that serves as the backbone for a document management system.

Dochero allows and restricts access to documents stored using a permissions based, role based and access sharing framework.

The system abstracts its resources into the following:
* Users
* Documents
* Roles

### HTTP VERBS & ENDPOINTS

### Users
| Title  	|  URL 	|  Method 	| URL params
|---	|---	|---	|----  |
| Show all users  	| `/users`  	| `GET`  	| None|

#### Success Response
```javascript
code: 200
content:
[
  {
    "_id": "57c94278517ca48c9e5af00f",
    "email": "kingkong@dochero.com",
    "username": "kingkong",
    "lastname": "Kong",
    "firstname": "King",
    "__v": 0
  }]
```
### Error
```javascript
code: 401 / 404
content:
{
  success: false,
  message: 'Invalid operation. No access',
  status: '401: Unauthorised',
}
OR
{
  success: false,
  error: err,
  status: '404: Resource Not Found'
}

```
Note: This route is restricted to a user with the role `supra-admin`

| Title  	|  URL 	|  Method 	| URL params
|---	|---	|---	|---         |
| Retrieve user information for a single user 	|`/users/:user_id` 	| `GET`  	| Required: `user_id` Type: `ObjectID`

#### Success Response
```javascript
code: 200
content:
  {
    "_id": "57c94278517ca48c9e5af00f",
    "email": "kingkong@dochero.com",
    "username": "kingkong",
    "lastname": "Kong",
    "firstname": "King",
    "__v": 0
  }
```
### Error
```javascript
code: 404
content:
{
  success: false,
  error: err,
  message: 'User not found',
  status: '404: Resource Not Found'
}

```

|  Title 	|  URL 	| Method  	| URL params  	|
|---	|---	|---	|---	|
| Update user information for a single user  	| `/users/:user_id`  	|   `PUT` 	 	| Required: `user_id` Type: `ObjectID` |


### Data params
```javascript
{
  firstname: [String],
  lastname: [String],
  username: [String],
  email: [String],
  password: [String],
  role(optional): [String]
}
```

#### Success Response
```javascript
code: 200
content:
  {
    "_id": "57c94278517ca48c9e5af00f",
    "email": "kingkong@dochero.com",
    "username": "kingkong",
    "lastname": "Kong",
    "firstname": "King",
    "__v": 0
  }
```
### Error
```javascript
code: 401
content:
{
  success: false,
  error: err,
  message: 'Cannot update another users details',
  status: '401: Unauthorised'
}
```
Notes: This route is restricted to the logged in user and their details.

| Title  	| URL  	|Method   	| URL params  	|
|---	|---	|---	|---	|
| Delete a single users' information  	| `/users/:user_id`  	|`DELETE`   	| Required: `user_id` Type: `ObjectID`	|


#### Success Response
```javascript
code: 200
content:
{
  success: true,
  message: 'User deleted successfully'
}
```
### Error
```javascript
code: 401
content:
{
  success: false,
  message: 'Cannot delete another user. Can only delete yourself',
  status: '401: Unauthorised'
}
OR
{
  error: err,
  message: 'Error deleting user',
  status: '500: Server Error',
}
```
Notes: This route is restricted to the logged in user and their details.

### Documents

| Title  	| URL  	|  Method 	| URL params|
|---	|---	|---	|--- |
| Create a document  	|  `/documents` 	| `POST`  	|None

### Data params
```javascript
{
  title: [String],
  content: [String],
  privacy: [String],
  sharewith: [ObjectID],
  access: [ObjectID],
}
```

#### Success Response
```javascript
code: 201
content:
  {
    success: true,
    message: 'Document created successfully',
    status: '201: Resource Created'
  }

```
### Error
```javascript
code: 401
content:
{
  error: err,
  message: 'Document could not be created',
  status: '500: Internal Server Error'
}
```

| Title  	|  URL 	| Method  	| URL params
|---	|---	|---	|----  |
|  Show all documents 	| `/documents`  	| `GET`  	| None|

#### Success Response
```javascript
code: 201
content:
[{
   "_id": "57d3b9b4589d180754870376",
   "updatedAt": "2016-09-10T07:43:48.081Z",
   "createdAt": "2016-09-10T07:43:48.081Z",
   "access": "57d07f4985e43ea1140ed44e",
   "_creatorId": "57d121848xxxxxxxxcd6142",
   "privacy": "private",
   "content": "Top secret",
   "title": "Other secret admin things",
   "__v": 0
 }]
```
Note: This route is restricted to the logged in users documents and all public documents

|  Title 	|  URL 	|  Method 	| URL params
|---	|---	|---	|----  |
| Show a specific document  	| `/documents/:document_id`  	|   `GET`	|Required: `document_id` Type: `ObjectID`|

#### Success Response
```javascript
code: 201
content:
{
   "_id": "57d3b9b4589d180754870376",
   "updatedAt": "2016-09-10T07:43:48.081Z",
   "createdAt": "2016-09-10T07:43:48.081Z",
   "access": "57d07f4985e43ea1140ed44e",
   "_creatorId": "57d121848xxxxxxxxcd6142",
   "privacy": "private",
   "content": "Top secret",
   "title": "Other secret admin things",
   "__v": 0
 }
```
### Error
```javascript
code: 401
content:
{
  success: false,
  message: 'Cannot access document by that id',
  status: '401: Unauthorised'
}
```
Note: This route is restricted to the logged in users' documents

|  Title 	|  URL 	| Method  	|URL params
|---	|---	|---	|----- |
| Edit a specific document  	|  `/documents/:document_id` 	|  `PUT` 	| Required: `document_id` Type: `ObjectID` |


### Data params
```javascript
{
  title: [String], Required
  content: [String], Required,
  privacy: [String], Required either: public or private
  sharewith: [ObjectID]: Optional,
  access: [ObjectID]: Optional
}
```

#### Success Response
```javascript
code: 200
content:
{
  success: true,
  message: 'Document details updated successfully'
}
```
### Error
```javascript
code: 500
content:
{
  error: err,
  message: 'Error saving document',
  status: '500: Server Error'
}
```
|  Title 	| URL  	|  Method 	| URL params  	|
|---	|---	|---	|---	|
| Delete a specific document  	| `/documents/:document_id`  	| `DELETE`  	| Required: `document_id` Type: `ObjectID` |


#### Success Response
```javascript
code: 200
content:
{
  success: true,
  message: 'Document Deleted successfully'
}
```
### Error
```javascript
code: 500
content:
{
  error: err,
  message: 'Error saving document',
  status: '500: Server Error'
}
```
| Title  	|  URL 	| Method  	|  URL params  	|
|---	|---	|---	|---	|
| Show a document that belongs to a specific user  	| `/users/:creator_id/documents`  	| `GET`  	| Required: `creator_id` Type: `ObjectID` |


#### Success Response
```javascript
code: 200
content:
[
  {
  "_id": "57d13112ccb820a01934da3c",
  "updatedAt": "2016-09-08T09:37:11.912Z",
  "createdAt": "2016-09-08T09:36:18.640Z",
  "_creatorId": "57d1218482900bbxxxxxx6142",
  "privacy": "private",
  "content": "Administrator things. Users not allowed!",
  "title": "Admin things",
  "__v": 0
},
]
```
### Error
```javascript
code: 404
content:
{
  message: 'No documents were found for that user. \
  The document you are referring to may be private',
  status: '404: Resource Not Found'
}
```
Notes: This route is restricted to the logged in users' documents and public documents

### Roles
The role resource is managed be the following routes and has a similar format of results as the users and documents resources.

`POST/GET /roles`
`GET/PUT/DELETE /roles/:role_id`
