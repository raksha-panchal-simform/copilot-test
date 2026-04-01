export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  birthday?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  age?: number;
  birthday?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  age?: number;
  birthday?: string;
}
