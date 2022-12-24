import 'dotenv/config';

export const PORT = process.env.PORT || 4000;
export const ENDPOINT_USERS = '/api/users';
export const ENDPOINT_USERS_ID = `${ENDPOINT_USERS}/`;

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum HttpMethod {
  DELETE = 'DELETE',
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
}
