import * as http from 'node:http';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { getReqData } from '../services/http.service';
import { checkBody } from '../services/http.service';
import { HttpStatusCode } from '../constants/http.constants';
import { createUserIdError, sendResponse } from '../services/message.service';
export class UserController {
  async getUsers(res: http.ServerResponse) {
    const users = await new UserService().getUsers();
    sendResponse(res, HttpStatusCode.OK, users);
  }

  async getUserById(req: http.IncomingMessage, res: http.ServerResponse) {
    const id = String(req.url?.split('/')[3]);
    try {
      const user = await new UserService().getUserById(id);
      sendResponse(res, HttpStatusCode.OK, user);
    } catch (err) {
      createUserIdError(res, err, id);
    }
  }

  async createUser(req: http.IncomingMessage, res: http.ServerResponse) {
    const body = (await getReqData(req)) as User;
    const bodyError = checkBody(body, ['username', 'age', 'hobbies']);
    if (bodyError) {
      sendResponse(res, HttpStatusCode.BAD_REQUEST, bodyError);
    } else {
      const user = await new UserService().createUser(body);
      sendResponse(res, HttpStatusCode.CREATED, user);
    }
  }

  async updateUser(req: http.IncomingMessage, res: http.ServerResponse) {
    const id = String(req.url?.split('/')[3]);
    try {
      const body = (await getReqData(req)) as User;
      const bodyError = checkBody(body, ['username', 'age', 'hobbies']);
      if (bodyError) {
        sendResponse(res, HttpStatusCode.BAD_REQUEST, bodyError);
      } else {
        const user = await new UserService().updateUser(id, body);
        sendResponse(res, HttpStatusCode.OK, user);
      }
    } catch (err) {
      createUserIdError(res, err, id);
    }
  }

  async deleteUser(req: http.IncomingMessage, res: http.ServerResponse) {
    const id = String(req.url?.split('/')[3]);
    try {
      const deletedUserMeassage = await new UserService().deleteUser(id);
      sendResponse(res, HttpStatusCode.NO_CONTENT, deletedUserMeassage);
    } catch (err) {
      createUserIdError(res, err, id);
    }
  }
}
