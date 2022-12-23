import * as http from 'node:http';
import { PORT } from './constants/http.constants.js';
import 'dotenv/config';
import { UserController } from './controllers/user.controller.js';
import {
  HttpStatusCode,
  HttpMethod,
  ENDPOINT_USERS,
  ENDPOINT_USERS_ID,
} from './constants/http.constants.js';
import cluster from 'node:cluster';
import { User } from './models/user.model.js';
import { usersStorage, modifyUsers } from './data/user.data.js';
const workerPort = process.env.workerPort;

export async function listenToRequests(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
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
}

export const server = http
  .createServer(async (req, res) => {
    await listenToRequests(req, res);
    console.log(usersStorage, ' usersStorage from server1');
    cluster.worker?.send({ users: usersStorage });
    console.log(usersStorage, ' usersStorage from server2');
    console.log(
      `Worker ${String(cluster.worker?.id)} returned response on request`
    );
  })
  .listen(workerPort || PORT, () => {
    console.log(`Worker ${process.pid} started on ${String(workerPort)}`);
  });

process.on('message', (message: { users: User[] }) => {
  console.log(message.users, 'from server');
  modifyUsers(message.users);
});
