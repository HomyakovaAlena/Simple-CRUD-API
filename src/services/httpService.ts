import http from 'node:http';

export function getReqData(req: http.IncomingMessage) {
  return new Promise((resolve, reject) => {
    try {
      let body = '';
      req.on('data', (chunk: string) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        console.log(body);
        resolve(JSON.parse(body));
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function createError(statusCode: number, message: string) {
  return { statusCode, message };
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
    return `properties [ ${extraProps.join(',')} ] shouldn't exist`;
  }

  return null;
}
