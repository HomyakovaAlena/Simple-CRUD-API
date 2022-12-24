import { User } from '../models/user.model';
import { usersStorage, modifyUsers } from '../data/user.data';

export function saveUser(user: User) {
  usersStorage.push(user);
}

export function deleteUser(userId: string) {
  modifyUsers(usersStorage.filter((foundUser) => foundUser.id !== userId));
}

export function updateUser(user: User) {
  const id = user.id;
  deleteUser(id);
  saveUser(user);
}
