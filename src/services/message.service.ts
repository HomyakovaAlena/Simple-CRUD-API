import * as http from 'node:http';
import { HttpStatusCode } from '../constants/http.constants';

export function sendResponse(
  res: http.ServerResponse,
  statusCode: number,
  msg: unknown
) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
  });
  if (typeof msg === 'string') {
    res.end(JSON.stringify({ message: msg }));
  } else {
    res.end(JSON.stringify(msg));
  }
}

export function createUserIdError(
  res: http.ServerResponse,
  err: unknown,
  id: string
) {
  if (err === `User with id ${id} not found`) {
    sendResponse(res, HttpStatusCode.NOT_FOUND, err);
  } else {
    sendResponse(res, HttpStatusCode.BAD_REQUEST, err);
  }
}

export function create404Response(res: http.ServerResponse) {
  sendResponse(res, HttpStatusCode.NOT_FOUND, 'Route not found');
}

export function create500Response(res: http.ServerResponse) {
  sendResponse(
    res,
    HttpStatusCode.INTERNAL_SERVER_ERROR,
    "An error occured on the web server you're trying to access"
  );
}
