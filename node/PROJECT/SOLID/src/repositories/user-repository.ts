import { Prisma, User } from "@prisma/client";

export abstract class UserRepository {
  abstract create(data: Prisma.UserCreateInput): Promise<User>;
  abstract findUnique(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
}
