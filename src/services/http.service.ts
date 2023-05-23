import http from 'node:http';
import {
  HttpMethod,
  ENDPOINT_USERS,
  ENDPOINT_USERS_ID,
} from '../constants/http.constants';

export function defineRequestType(req: http.IncomingMessage) {
  if (req.url === ENDPOINT_USERS && req.method === HttpMethod.GET) {
    return 'getUsersRequest';
  } else if (
    req.url?.startsWith(ENDPOINT_USERS_ID) &&
    req.method === HttpMethod.GET
  ) {
    return 'getUserByIdRequest';
  } else if (req.url === ENDPOINT_USERS && req.method === HttpMethod.POST) {
    return 'postRequest';
  } else if (
    req.url?.startsWith(ENDPOINT_USERS_ID) &&
    req.method === HttpMethod.PUT
  ) {
    return 'putRequest';
  } else if (
    req.url?.startsWith(ENDPOINT_USERS_ID) &&
    req.method === HttpMethod.DELETE
  ) {
    return 'deleteRequest';
  }
  return 'default';
}

export function getReqData(req: http.IncomingMessage) {
  return new Promise((resolve, reject) => {
    try {
      let body = '';
      req.on('data', (chunk: string) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        console.log(body);
        resolve(body ? JSON.parse(body) : {});
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function checkBody(body: object, keys: string[]) {
  const bodyKeys = Object.keys(body);
  if (bodyKeys.length === 0) {
    return 'body is required';
  }
  for (const key of keys) {
    if (!body.hasOwnProperty(key)) {
      return `${key} is required`;
    }
  }
  if (bodyKeys.length > keys.length) {
    const extraProps = bodyKeys.filter((prop) => !keys.includes(prop));
    return `property(-ies) ${extraProps.join(',')} shouldn't exist`;
  }

  return null;
}
