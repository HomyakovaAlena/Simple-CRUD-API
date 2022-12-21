import * as http from 'node:http';
import 'dotenv/config';
import { Controller } from './controllers/controllers';
import { getReqData } from './services/httpService';
import { checkBody } from './services/httpService';
import { User } from './models/models';

export const PORT = process.env.PORT || 4000;

export const server = http.createServer(async (req, res) => {
  if (req.url === '/api/users' && req.method === 'GET') {
    const users = await new Controller().getUsers();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } else if (req.url?.startsWith('/api/users/') && req.method === 'GET') {
    const id = req.url.split('/')[3];
    try {
      const user = await new Controller().getUserById(id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } catch (err) {
      if (err === `User with id ${id} not found`) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
      }
      res.end(JSON.stringify({ message: err }));
    }
  } else if (req.url === '/api/users' && req.method === 'POST') {
    const body = (await getReqData(req)) as User;
    const bodyError = checkBody(body, ['username', 'age', 'hobbies']);
    if (bodyError) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: bodyError }));
    } else {
      const user = await new Controller().createUser(body);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    }
  } else if (req.url?.startsWith('/api/users/') && req.method === 'PUT') {
    const id = req.url.split('/')[3];
    try {
      const body = (await getReqData(req)) as User;
      const user = await new Controller().updateUser(id, body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } catch (err) {
      if (err === `User with id ${id} not found`) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
      } else {
        console.log(err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
      }
      res.end(JSON.stringify({ message: err }));
    }
  } else if (req.url?.startsWith('/api/users/') && req.method === 'DELETE') {
    const id = req.url.split('/')[3];
    try {
      const deletedUserMeassage = await new Controller().deleteUser(id);
      console.log(deletedUserMeassage);
      res.writeHead(204, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: deletedUserMeassage }));
    } catch (err) {
      if (err === `User with id ${id} not found`) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
      } else {
        console.log(err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
      }
      res.end(JSON.stringify({ message: err }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

export const app = server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
