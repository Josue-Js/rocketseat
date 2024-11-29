import { Prisma, User } from "@prisma/client";
import { UserRepository } from "../user-repository";
import { randomUUID } from "crypto";

export class InMemoryUserRepository implements UserRepository {
  users: User[] = [];

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      role: data.role ?? "MEMBER",
      password_hash: data.password_hash,
      created_at: new Date(),
    };
    this.users.push(user);

    return user;
  }

  async findUnique(email: string) {
    const user = this.users.find((user) => user.email === email) || null;
    return user;
  }

  async findById(id: string) {
    const user = this.users.find((user) => user.id === id) || null;
    return user;
  }
}
