import * as http from 'node:http';
import { HttpStatusCode } from '../constants/http.constants.js';

export function createError(
  res: http.ServerResponse,
  err: unknown,
  id: string
) {
  if (err === `User with id ${id} not found`) {
    res.writeHead(HttpStatusCode.NOT_FOUND, {
      'Content-Type': 'application/json',
    });
  } else {
    res.writeHead(HttpStatusCode.BAD_REQUEST, {
      'Content-Type': 'application/json',
    });
  }
  res.end(JSON.stringify({ message: err }));
}
