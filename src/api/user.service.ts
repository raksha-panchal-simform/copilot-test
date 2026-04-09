import { v4 as uuidv4 } from "uuid";
import { User, CreateUserRequest, UpdateUserRequest } from "./user.model";

const users: Map<string, User> = new Map();

export function findAllUsers(page: number, limit: number): { users: User[]; totalItems: number } {
  const allUsers = Array.from(users.values());
  const totalItems = allUsers.length;
  const start = (page - 1) * limit;
  const paginatedUsers = allUsers.slice(start, start + limit);
  return { users: paginatedUsers, totalItems };
}

export function findUserById(id: string): User | undefined {
  return users.get(id);
}

export function createUser(data: CreateUserRequest): User {
  const now = new Date().toISOString();
  const user: User = {
    id: uuidv4(),
    name: data.name,
    email: data.email,
    age: data.age,
    birthday: data.birthday,
    createdAt: now,
    updatedAt: now,
  };
  users.set(user.id, user);
  return user;
}

export function updateUser(id: string, data: UpdateUserRequest): User | undefined {
  const existing = users.get(id);
  if (!existing) return undefined;

  const updated: User = {
    ...existing,
    ...(data.name !== undefined && { name: data.name }),
    ...(data.email !== undefined && { email: data.email }),
    ...(data.age !== undefined && { age: data.age }),
    ...(data.birthday !== undefined && { birthday: data.birthday }),
    updatedAt: new Date().toISOString(),
  };
  users.set(id, updated);
  return updated;
}

export function deleteUser(id: string): boolean {
  return users.delete(id);
}
