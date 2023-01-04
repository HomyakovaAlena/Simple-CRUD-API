import * as http from 'node:http';
import { UserController } from '../controllers/user.controller';
import {
  create404Response,
  create500Response,
} from '../services/message.service';
import { defineRequestType } from '../services/http.service';

export async function listenToRequests(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  try {
    const request = defineRequestType(req);
    switch (request) {
      case 'getUsersRequest':
        await new UserController().getUsers(res);
        break;
      case 'getUserByIdRequest':
        await new UserController().getUserById(req, res);
        break;
      case 'postRequest':
        await new UserController().createUser(req, res);
        break;
      case 'putRequest':
        await new UserController().updateUser(req, res);
        break;
      case 'deleteRequest':
        await new UserController().deleteUser(req, res);
        break;
      default:
        create404Response(res);
    }
  } catch (err) {
    create500Response(res);
  }
}
