import * as http from 'node:http';
import { UserService } from '../services/user.service.js';
import { User } from '../models/user.model.js';
import { getReqData } from '../services/http.service.js';
import { checkBody } from '../services/http.service.js';
import { HttpStatusCode } from '../constants/http.constants.js';

export class UserController {
  async getUsers(res: http.ServerResponse) {
    const users = await new UserService().getUsers();
    res.writeHead(HttpStatusCode.OK, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  }

  async getUserById(req: http.IncomingMessage, res: http.ServerResponse) {
    const id = String(req.url?.split('/')[3]);
    try {
      const user = await new UserService().getUserById(id);
      res.writeHead(HttpStatusCode.OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } catch (err) {
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
  }

  async createUser(req: http.IncomingMessage, res: http.ServerResponse) {
    const body = (await getReqData(req)) as User;
    const bodyError = checkBody(body, ['username', 'age', 'hobbies']);
    if (bodyError) {
      res.writeHead(HttpStatusCode.BAD_REQUEST, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ message: bodyError }));
    } else {
      const user = await new UserService().createUser(body);
      res.writeHead(HttpStatusCode.CREATED, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify(user));
    }
  }

  async updateUser(req: http.IncomingMessage, res: http.ServerResponse) {
    const id = String(req.url?.split('/')[3]);
    try {
      const body = (await getReqData(req)) as User;
      const user = await new UserService().updateUser(id, body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } catch (err) {
      if (err === `User with id ${id} not found`) {
        res.writeHead(HttpStatusCode.NOT_FOUND, {
          'Content-Type': 'application/json',
        });
      } else {
        console.log(err);
        res.writeHead(HttpStatusCode.BAD_REQUEST, {
          'Content-Type': 'application/json',
        });
      }
      res.end(JSON.stringify({ message: err }));
    }
  }

  async deleteUser(req: http.IncomingMessage, res: http.ServerResponse) {
    const id = String(req.url?.split('/')[3]);
    try {
      const deletedUserMeassage = await new UserService().deleteUser(id);
      console.log(deletedUserMeassage);
      res.writeHead(HttpStatusCode.NO_CONTENT, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ message: deletedUserMeassage }));
    } catch (err) {
      if (err === `User with id ${id} not found`) {
        res.writeHead(HttpStatusCode.NOT_FOUND, {
          'Content-Type': 'application/json',
        });
      } else {
        console.log(err);
        res.writeHead(HttpStatusCode.BAD_REQUEST, {
          'Content-Type': 'application/json',
        });
      }
      res.end(JSON.stringify({ message: err }));
    }
  }
}
