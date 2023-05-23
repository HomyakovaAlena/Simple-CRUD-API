import supertest from 'supertest';
import { server } from '../src/server';
import { validate as uuidValidate } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import { afterEach, expect, jest } from '@jest/globals';
import { modifyUsers } from '../src/data/user.data';
import 'dotenv/config';
const environment = process.env.NODE_ENV;

console.log(environment);

const newUser = {
  username: 'Bonifacio',
  age: 94,
  hobbies: ['swimming', 'running'],
};
const { username, age, hobbies } = newUser;

afterEach(() => {
  server.close();
  modifyUsers([]);
});

describe('Get Endpoint', () => {
  it('should create a new get all users request', async () => {
    const res = await supertest(server).get('/api/users').send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });
});

describe('Get Endpoint', () => {
  it('should create a new get user by id request', async () => {
    const responsePost = await supertest(server)
      .post('/api/users')
      .send(newUser);
    const id = responsePost.body.id;
    const responseGet = await supertest(server).get(`/api/users/${id}`).send();
    expect(responseGet.statusCode).toEqual(200);
    expect(responseGet.body).toStrictEqual({ id, ...newUser });
  });
  it('should send 400 if get user by id request consists not valid id (not uuid)', async () => {
    const wrongId = 123;
    const responseGet = await supertest(server)
      .get(`/api/users/${wrongId}`)
      .send();
    expect(responseGet.statusCode).toEqual(400);
    expect(responseGet.body.message).toEqual(`User id ${wrongId} is invalid`);
  });
  it('should send 404 if record with id === userId does not exist', async () => {
    const wrongId = uuidv4();
    const responseGet = await supertest(server)
      .get(`/api/users/${wrongId}`)
      .send();
    expect(responseGet.statusCode).toEqual(404);
    expect(responseGet.body.message).toEqual(
      `User with id ${wrongId} not found`
    );
  });
});

describe('Post Endpoint', () => {
  it('should create a new post request', async () => {
    const res = await supertest(server).post('/api/users').send(newUser);
    expect(res.statusCode).toEqual(201);
    expect(res.body.username).toEqual('Bonifacio');
    expect(res.body.hobbies).toEqual(['swimming', 'running']);
    expect(uuidValidate(res.body.id)).toBeTruthy;
  });
  it('should shuld send 400 and corresponding message if request body does not contain required fields or contains extra fields', async () => {
    const responseWithoutUsername = await supertest(server)
      .post('/api/users')
      .send({
        age,
        hobbies,
      });
    const responseWithoutAge = await supertest(server).post('/api/users').send({
      username,
      hobbies,
    });
    const responseWithoutHobbies = await supertest(server)
      .post('/api/users')
      .send({
        username,
        age,
      });
    const responseWitAdditionalFields = await supertest(server)
      .post('/api/users')
      .send({
        wrongField: 123,
        ...newUser,
      });
    const responses = [
      responseWithoutUsername,
      responseWithoutAge,
      responseWithoutHobbies,
      responseWitAdditionalFields,
    ];
    responses.forEach((response) => expect(response.statusCode).toEqual(400));
    expect(responseWithoutUsername.body.message).toEqual(
      `username is required`
    );
    expect(responseWithoutAge.body.message).toEqual(`age is required`);
    expect(responseWithoutHobbies.body.message).toEqual(`hobbies is required`);
    expect(responseWitAdditionalFields.body.message).toEqual(
      `property(-ies) wrongField shouldn't exist`
    );
  });
});

describe('Put Endpoint', () => {
  it('should create a new put request', async () => {
    const responsePost = await supertest(server)
      .post('/api/users')
      .send(newUser);
    const id = responsePost.body.id;
    const updatedUser = {
      username: 'Antonio',
      age: 17,
      hobbies: ['programming'],
    };
    const responsePut = await supertest(server)
      .put(`/api/users/${id}`)
      .send(updatedUser);
    expect(responsePut.statusCode).toEqual(200);
    expect(responsePut.body).toStrictEqual({ id, ...updatedUser });
  });
  it('should send 400 if get user by id request consists not valid id (not uuid)', async () => {
    const wrongId = 123;
    const responsePut = await supertest(server)
      .put(`/api/users/${wrongId}`)
      .send({
        username,
        age,
        hobbies,
      });
    expect(responsePut.statusCode).toEqual(400);
    expect(responsePut.body.message).toEqual(`User id ${wrongId} is invalid`);
  });
  it('should shuld send 400 and corresponding message if request body does not contain required fields or contains extra fields', async () => {
    const responsePost = await supertest(server)
      .post('/api/users')
      .send(newUser);
    const id = responsePost.body.id;
    const responseWithoutUsername = await supertest(server)
      .put(`/api/users/${id}`)
      .send({
        age,
        hobbies,
      });
    const responseWithoutAge = await supertest(server).post('/api/users').send({
      username,
      hobbies,
    });
    const responseWithoutHobbies = await supertest(server)
      .put(`/api/users/${id}`)
      .send({
        username,
        age,
      });
    const responseWitAdditionalFields = await supertest(server)
      .put(`/api/users/${id}`)
      .send({
        username,
        age,
        hobbies,
        wrongField: 123,
      });
    const responses = [
      responseWithoutUsername,
      responseWithoutAge,
      responseWithoutHobbies,
      responseWitAdditionalFields,
    ];
    responses.forEach((response) => expect(response.statusCode).toEqual(400));
    expect(responseWithoutUsername.body.message).toEqual(
      `username is required`
    );
    expect(responseWithoutAge.body.message).toEqual(`age is required`);
    expect(responseWithoutHobbies.body.message).toEqual(`hobbies is required`);
    expect(responseWitAdditionalFields.body.message).toEqual(
      `property(-ies) wrongField shouldn't exist`
    );
  });
  it('should send 404 if record with id === userId does not exist', async () => {
    const wrongId = uuidv4();
    const responsePut = await supertest(server)
      .put(`/api/users/${wrongId}`)
      .send(newUser);
    expect(responsePut.statusCode).toEqual(404);
    expect(responsePut.body.message).toEqual(
      `User with id ${wrongId} not found`
    );
  });
});

describe('Delete Endpoint', () => {
  it('should create a new delete request', async () => {
    const responsePost = await supertest(server)
      .post('/api/users')
      .send(newUser);
    const id = responsePost.body.id;
    const responseDelete = await supertest(server)
      .delete(`/api/users/${id}`)
      .send();
    expect(responseDelete.statusCode).toEqual(204);
  });
  it('should send 400 if get user by id request consists not valid id (not uuid)', async () => {
    const wrongId = 123;
    const responseDelete = await supertest(server)
      .delete(`/api/users/${wrongId}`)
      .send();
    expect(responseDelete.statusCode).toEqual(400);
    expect(responseDelete.body.message).toEqual(
      `User id ${wrongId} is invalid`
    );
  });
  it('should send 404 if record with id === userId does not exist', async () => {
    const wrongId = uuidv4();
    const responseDelete = await supertest(server)
      .delete(`/api/users/${wrongId}`)
      .send();
    expect(responseDelete.statusCode).toEqual(404);
    expect(responseDelete.body.message).toEqual(
      `User with id ${wrongId} not found`
    );
  });
});

describe('Server errors and not found route errors', () => {
  it('should send 404 if route does not exist', async () => {
    const responseGet = await supertest(server).get('/api/user').send();
    const responsePost = await supertest(server)
      .post('/api/user')
      .send(newUser);
    const responsePut = await supertest(server)
      .put('/api/user')
      .send({
        username: 'Antonio',
        age: 17,
        hobbies: ['programming'],
      });
    const responseDelete = await supertest(server).delete('/api/user').send();
    const responses = [responseGet, responsePost, responsePut, responseDelete];
    responses.forEach((response) => expect(response.statusCode).toEqual(404));
    responses.forEach((response) =>
      expect(response.body.message).toEqual(`Route not found`)
    );
  });

  it('mock server error should send answer with 500 status code', async () => {
    try {
      const asyncMock = jest
        .fn<() => Promise<never>>()
        .mockRejectedValue(new Error('Mock server error with 500 status code'));

      await asyncMock();
      const res = await supertest(server).get('/api/users').send();
      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual(
        `An error occured on the web server you're trying to access`
      );
    } catch (err) {
      console.log(err);
    }
  });
});

describe(`Scenario 1: GET api/users > POST api/users > GET api/user/{userId} 
          > PUT api/users/{userId} > DELETE api/users/{userId} > GET api/users/{userId}`, () => {
  it('should return proper answers if no client errors occur', async () => {
    const responseGetAll = await supertest(server).get('/api/users').send();
    expect(responseGetAll.statusCode).toEqual(200);
    expect(responseGetAll.body).toEqual([]);

    const responsePost = await supertest(server)
      .post('/api/users')
      .send(newUser);
    expect(responsePost.statusCode).toEqual(201);
    expect(responsePost.body.username).toEqual('Bonifacio');
    expect(responsePost.body.hobbies).toEqual(['swimming', 'running']);
    expect(uuidValidate(responsePost.body.id)).toBeTruthy;

    const id = responsePost.body.id;
    const responseGetUserById = await supertest(server)
      .get(`/api/users/${id}`)
      .send();
    expect(responseGetUserById.statusCode).toEqual(200);
    expect(responseGetUserById.body).toStrictEqual({ id, ...newUser });

    const updatedUser = {
      username: 'Antonio',
      age: 17,
      hobbies: ['programming'],
    };
    const responsePut = await supertest(server)
      .put(`/api/users/${id}`)
      .send(updatedUser);
    expect(responsePut.statusCode).toEqual(200);
    expect(responsePut.body).toStrictEqual({ id, ...updatedUser });

    const responseDelete = await supertest(server)
      .delete(`/api/users/${id}`)
      .send();
    expect(responseDelete.statusCode).toEqual(204);

    const responseGetUserById2 = await supertest(server)
      .get(`/api/users/${id}`)
      .send();
    expect(responseGetUserById2.statusCode).toEqual(404);
    expect(responseGetUserById2.body.message).toEqual(
      `User with id ${id} not found`
    );
  });
});

describe(`Scenario 2: GET api/users/ > POST api/users > GET api/user/{userId} 
          > PUT api/users/{userId} > DELETE api/users/{userId} > GET api/users/{userId}`, () => {
  it('should return proper answers if invalid data passed', async () => {
    const responseGetAll = await supertest(server).get('/api/users/').send();
    expect(responseGetAll.statusCode).toEqual(400);
    expect(responseGetAll.body.message).toEqual(`User id  is invalid`);

    const id = uuidv4();
    const wrongUser = { id, ...newUser };
    const responsePost = await supertest(server)
      .post('/api/users')
      .send(wrongUser);
    expect(responsePost.statusCode).toEqual(400);
    expect(responsePost.body.message).toEqual(
      `property(-ies) id shouldn't exist`
    );

    const responseGetUserById = await supertest(server)
      .get(`/api/users/${id}`)
      .send();
    expect(responseGetUserById.statusCode).toEqual(404);
    expect(responseGetUserById.body.message).toEqual(
      `User with id ${id} not found`
    );

    const updatedUser = {
      username: 'Antonio',
      age: 17,
      hobbies: ['programming'],
    };
    const responsePut = await supertest(server)
      .put(`/api/users/${id}`)
      .send(updatedUser);
    expect(responsePut.statusCode).toEqual(404);
    expect(responsePut.body.message).toEqual(`User with id ${id} not found`);

    const responseDelete = await supertest(server)
      .delete(`/api/users/${id}`)
      .send();
    expect(responseDelete.statusCode).toEqual(404);
    expect(responseDelete.body.message).toEqual(`User with id ${id} not found`);

    const responseGetUserById2 = await supertest(server)
      .get(`/api/users/${id}`)
      .send();
    expect(responseGetUserById2.statusCode).toEqual(404);
    expect(responseGetUserById2.body.message).toEqual(
      `User with id ${id} not found`
    );
  });
});

describe(`Scenario 3: GET api/users > POST api/users > GET api/user/{userId} 
          > PUT api/users/{userId} > DELETE api/users/{userId} > GET api/users/{userId}`, () => {
  it('server should restore and return proper answers after server error occur + correctly answer if no body provided where it is required', async () => {
    try {
      const asyncMock = jest
        .fn<() => Promise<never>>()
        .mockRejectedValue(new Error('Mock server error with 500 status code'));

      await asyncMock();
      const res = await supertest(server).get('/api/users').send();
      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual(
        `An error occured on the web server you're trying to access`
      );
    } catch (err) {
      console.log(err);
    }

    const responsePost = await supertest(server)
      .post('/api/users')
      .send(newUser);
    expect(responsePost.statusCode).toEqual(201);
    expect(responsePost.body.username).toEqual('Bonifacio');
    expect(responsePost.body.hobbies).toEqual(['swimming', 'running']);
    expect(uuidValidate(responsePost.body.id)).toBeTruthy;

    const id = responsePost.body.id;
    const responseGetUserById = await supertest(server)
      .get(`/api/users/${id}`)
      .send();
    expect(responseGetUserById.statusCode).toEqual(200);
    expect(responseGetUserById.body).toStrictEqual({ id, ...newUser });

    const responsePutWithoutBody = await supertest(server)
      .put(`/api/users/${id}`)
      .send();
    expect(responsePutWithoutBody.statusCode).toEqual(400);
    expect(responsePutWithoutBody.body.message).toStrictEqual(
      'body is required'
    );

    const responseDelete = await supertest(server)
      .delete(`/api/users/${id}`)
      .send();
    expect(responseDelete.statusCode).toEqual(204);

    const responseGetUserById2 = await supertest(server)
      .get(`/api/users/${id}`)
      .send();
    expect(responseGetUserById2.statusCode).toEqual(404);
    expect(responseGetUserById2.body.message).toEqual(
      `User with id ${id} not found`
    );
  });
});
