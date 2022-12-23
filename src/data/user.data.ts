import { User } from '../models/user.model.js';

export let usersStorage: User[] = [];

export function modifyUsers(value: User[]) {
  usersStorage = value;
}
