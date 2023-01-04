import * as http from 'node:http';
import { PORT } from './constants/http.constants';
import 'dotenv/config';
import cluster from 'node:cluster';
import { User } from './models/user.model';
import { usersStorage, modifyUsers } from './data/user.data';
import { listenToRequests } from './controllers/request.listener';

const workerPort = process.env.workerPort;
const environment = process.env.NODE_ENV;
let portToListen = environment === 'multi' ? workerPort : PORT;

export const server = http
  .createServer(async (req, res) => {
    await listenToRequests(req, res);
    if (environment === 'multi') {
      cluster.worker?.send({ users: usersStorage });
      console.log(
        `Worker pid=${String(cluster.worker?.id)} (pid=${
          process.pid
        }) returned response on request`
      );
    }
  })
  .listen(portToListen, () => {
    const msg =
      environment === 'multi'
        ? `Worker pid=${process.pid} started on http://localhost:${String(
            portToListen
          )}`
        : `Server started on http://localhost:${String(portToListen)}...`;
    console.log(msg);
  });

if (environment === 'multi') {
  process.on('message', (message: { users: User[] }) => {
    modifyUsers(message.users);
  });
}
