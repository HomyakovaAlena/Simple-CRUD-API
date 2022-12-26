# Simple-CRUD-API

Simple CRUD API using in-memory database underneath (Node.js)

## Downloading

```bash
git clone {repository URL}
cd simple-crud-api
```

## Installing

```bash
npm install
```

## Running

Use following commands:

`npm run start:dev` - to run application in development mode

`npm run start:prod` - to run application in production mode

`npm run start:multi` - to run application with horizontal scaling and load balancer

`npm run test` - to test application

## REST service docs

### Endpoints:

- `User` (`api/users` route)

  - **GET** `api/users` - get all users
  - **GET** `api/users/:userId` - get the user by id (ex. “/users/123”, where id should be a valid uuid)
  - **POST** ` api/users` - create new user
  - **PUT** ` api/users/:userId` - update user
  - **DELETE** ` api/users/:userId` - delete user

## Test scenarios description:

Application tested firstly with unit tests for each endpoint:

- **Get Endpoint**
  - √ should create a new get all users request
  - √ should create a new get user by id request
  - √ should send 400 if get user by id request consists not valid id (not uuid)
  - √ should send 404 if record with id === userId does not exist
- **Post Endpoint**
  - √ should create a new post request
  - √ should shuld send 400 and corresponding message if request body does not contain required fields or contains extra fields
- **Put Endpoint**
  - √ should create a new put request
  - √ should send 400 if get user by id request consists not valid id (not uuid)
  - √ should shuld send 400 and corresponding message if request body does not contain required fields or contains extra fields
  - √ should send 404 if record with id === userId does not exist
- **Delete Endpoint**
  - √ should create a new delete request
  - √ should send 400 if get user by id request consists not valid id (not uuid)
  - √ should send 404 if record with id === userId does not exist
- **Server errors and not found route error**
  - √ should send 404 if route does not exist
  - √ mock server error should send answer with 500 status code

Then certain scenarios are tested on this chain of requests:

GET api/users > POST api/users > GET api/user/{userId} > PUT api/users/{userId} > DELETE api/users/{userId} > GET api/users/{userId}

- **1 scenario: BASE CASE** should return proper answers if no client errors occur
- **2 scenario: CLIENT ERROR CASE** should return proper answers if invalid data passed
- **3 scenario: SERVER ERROR CASE** server should restore and return proper answers after server error occur + answer correctly
  if no body provided where it is required
