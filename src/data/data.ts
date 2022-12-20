import { User } from '../models/models';

// eslint-disable-next-line prefer-const
export let USERS: User[] = [];

export function modifyUsers(value: User[]) {
  USERS = value;
}
