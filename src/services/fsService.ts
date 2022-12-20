import { User } from '../models/models.js';
import { USERS, modifyUsers } from '../data/data.js';

export function saveUser(user: User) {
  USERS.push(user);
}

export function deleteUser(userId: string) {
  modifyUsers(USERS.filter((foundUser) => foundUser.id !== userId));
}

export function updateUser(user: User) {
  const id = user.id;
  deleteUser(id);
  saveUser(user);
}
