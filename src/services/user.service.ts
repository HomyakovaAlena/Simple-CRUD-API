import { USERS } from '../data/user.data.js';
import { validate as uuidValidate } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import { User, CreatedUser } from '../models/user.model.js';
import { saveUser, deleteUser, updateUser } from './fs.service.js';

export class UserService {
  async getUsers() {
    return new Promise((resolve) => {
      resolve(USERS);
    });
  }

  async getUserById(id: string) {
    return new Promise((resolve, reject) => {
      const isValidUUID = uuidValidate(id);
      if (isValidUUID) {
        const foundUser = USERS.find((user: User) => user.id === id);
        if (foundUser) {
          resolve(foundUser);
        }
        reject(`User with id ${id} not found`);
      } else {
        reject(`User id ${id} is invalid`);
      }
    });
  }

  async createUser(userData: CreatedUser) {
    return new Promise((resolve) => {
      const generatedId = uuidv4();
      const createdUser = {
        id: generatedId,
        ...userData,
      };
      saveUser(createdUser);
      resolve(createdUser);
    });
  }

  async updateUser(id: string, userData: Partial<User>) {
    return new Promise((resolve, reject) => {
      const isValidUUID = uuidValidate(id);
      if (isValidUUID) {
        const foundUser = USERS.find((user: User) => user.id === id);
        if (!foundUser) {
          reject(`User with id ${id} not found`);
        }
        const updatedUser = {
          ...foundUser,
          ...userData,
        } as User;
        updateUser(updatedUser);
        resolve(updatedUser);
      } else {
        reject(`User id ${id} is invalid`);
      }
    });
  }

  async deleteUser(id: string) {
    return new Promise((resolve, reject) => {
      const isValidUUID = uuidValidate(id);
      if (isValidUUID) {
        const foundUser = USERS.find((user: User) => user.id === id);
        if (foundUser) {
          deleteUser(id);
          resolve(`User with id ${id} deleted`);
        }
        reject(`User with id ${id} not found`);
      } else {
        reject(`User id ${id} is invalid`);
      }
    });
  }
}
