import { compare } from "bcrypt";
import { User } from "@prisma/client";
import { UserRepository } from "@/repositories/user-repository";
import { InvalidCredentialsError } from "./erros/invalid-credentials-error";

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}
type AuthenticateUseCaseResponse = User;

export class AuthenticateUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.userRepository.findUnique(email);

    if (!user) throw new InvalidCredentialsError();

    const doesPasswordMatches = await compare(password, user.password_hash);

    if (!doesPasswordMatches) throw new InvalidCredentialsError();

    return user;
  }
}
