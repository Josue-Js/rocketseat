import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Encrypter } from "../cryptography/encrypt";
import { HashComparer } from "../cryptography/hash-comparer";
import { StudentsRepository } from "../repositories/student-repository";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";

interface AuthenticateStudentUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateStudentUseCaseResponse = Either<
  WrongCredentialsError,
  {
    access_token: string;
  }
>;

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentsRepository.findByEmail(email);

    if (!student) throw left(new WrongCredentialsError());

    const isPasswordValid = await this.hashComparer.compare(
      password,
      student.password
    );

    if (!isPasswordValid) throw left(new WrongCredentialsError());

    const access_token = await this.encrypter.encrypt({
      sub: student.id.toString(),
    });

    return right({ access_token });
  }
}
