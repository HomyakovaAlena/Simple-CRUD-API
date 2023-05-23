import { User } from '../models/user.model';

export let usersStorage: User[] = [];

export function modifyUsers(value: User[]) {
  usersStorage = value;
}
