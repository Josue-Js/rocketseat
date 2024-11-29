import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { UserRepository } from "@/repositories/user-repository";
import { UserAlreadyExistError } from "./erros/user-already-exists";
import { User } from "@prisma/client";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.userRepository.findUnique(email);

    if (userWithSameEmail) throw new UserAlreadyExistError();

    const password_hash = await hash(password, 10);
    const user = await this.userRepository.create({
      name,
      email,
      password_hash,
    });

    return { user };
  }
}
