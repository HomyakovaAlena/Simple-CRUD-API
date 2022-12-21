export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export type CreatedUser = Pick<User, 'username' | 'age' | 'hobbies'>;
