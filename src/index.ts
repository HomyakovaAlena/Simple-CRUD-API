import * as http from 'node:http';
import 'dotenv/config';
import { UserController } from './controllers/user.controller.js';
import {
  HttpStatusCode,
  HttpMethod,
  ENDPOINT_USERS,
  ENDPOINT_USERS_ID,
  PORT,
} from './constants/http.constants.js';

export const server = http.createServer(async (req, res) => {
  if (req.url === ENDPOINT_USERS && req.method === HttpMethod.GET) {
    await new UserController().getUsers(res);
  } else if (
    req.url?.startsWith(ENDPOINT_USERS_ID) &&
    req.method === HttpMethod.GET
  ) {
    await new UserController().getUserById(req, res);
  } else if (req.url === ENDPOINT_USERS && req.method === HttpMethod.POST) {
    await new UserController().createUser(req, res);
  } else if (
    req.url?.startsWith(ENDPOINT_USERS_ID) &&
    req.method === HttpMethod.PUT
  ) {
    await new UserController().updateUser(req, res);
  } else if (
    req.url?.startsWith(ENDPOINT_USERS_ID) &&
    req.method === HttpMethod.DELETE
  ) {
    await new UserController().deleteUser(req, res);
  } else {
    res.writeHead(HttpStatusCode.NOT_FOUND, {
      'Content-Type': 'application/json',
    });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

export const app = server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
