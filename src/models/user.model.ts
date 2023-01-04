export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export type CreatedUser = Required<Pick<User, 'username' | 'age' | 'hobbies'>>;
