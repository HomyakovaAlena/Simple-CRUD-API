import supertest from 'supertest';
import { server } from '../src/server';
import { validate as uuidValidate } from 'uuid';
import 'dotenv/config';
const environment = process.env.NODE_ENV;

const newUser = {
  username: 'Bonifacio',
  age: 94,
  hobbies: ['swimming', 'running'],
};
const { username, age, hobbies } = newUser;

describe('Get Endpoint', () => {
  it('should create a new get all users request', async () => {
    const res = await supertest(server).get('/api/users').send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });
});

describe('Post Endpoint', () => {
  it('should create a new post request', async () => {
    const res = await supertest(server).post('/api/users').send({
      username,
      age,
      hobbies,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.username).toEqual('Bonifacio');
    expect(res.body.hobbies).toEqual(['swimming', 'running']);
    expect(uuidValidate(res.body.id)).toBeTruthy;
  });
});

describe('Delete Endpoint', () => {
  it('should create a new delete request', async () => {
    const responsePost = await supertest(server).post('/api/users').send({
      username,
      age,
      hobbies,
    });
    const id = responsePost.body.id;
    const responseDelete = await supertest(server)
      .delete(`/api/users/${id}`)
      .send();
    expect(responseDelete.statusCode).toEqual(204);
  });
});

describe('Get Endpoint', () => {
  it('should create a new get user by id request', async () => {
    const responsePost = await supertest(server).post('/api/users').send({
      username,
      age,
      hobbies,
    });
    const id = responsePost.body.id;
    const responseGet = await supertest(server).get(`/api/users/${id}`).send();
    expect(responseGet.statusCode).toEqual(200);
    expect(responseGet.body.username).toEqual('Bonifacio');
    expect(responseGet.body.hobbies).toEqual(['swimming', 'running']);
    expect(responseGet.body.age).toEqual(94);
    expect(responseGet.body.id).toEqual(id);
  });
});

describe('Put Endpoint', () => {
  it('should create a new put request', async () => {
    const responsePost = await supertest(server).post('/api/users').send({
      username,
      age,
      hobbies,
    });
    const id = responsePost.body.id;
    const responsePut = await supertest(server)
      .put(`/api/users/${id}`)
      .send({
        username: 'Antonio',
        age: 17,
        hobbies: ['programming'],
      });
    expect(responsePut.statusCode).toEqual(200);
    expect(responsePut.body.username).toEqual('Antonio');
    expect(responsePut.body.hobbies).toEqual(['programming']);
    expect(responsePut.body.age).toEqual(17);
    expect(responsePut.body.id).toEqual(id);
  });
});
