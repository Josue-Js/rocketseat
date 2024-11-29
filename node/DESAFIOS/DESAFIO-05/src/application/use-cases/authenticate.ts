import { BadRequestException, Injectable } from "@nestjs/common";
import { Encrypter } from "../cryptography/encrypt";
import { HashComparer } from "../cryptography/hash-comparer";
import { CourierRepository } from "../repositories/courier-repository";

interface AuthenticateUseCaseRequest {
  cpf: string;
  password: string;
}

type AuthenticateUseCaseResponse = {
  access_token: string;
};

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private courierRepository: CourierRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const courier = await this.courierRepository.findByCpf(cpf);

    if (!courier) throw new BadRequestException("Credentials invalid");

    const isPasswordValid = await this.hashComparer.compare(
      password,
      courier.password,
    );

    if (!isPasswordValid) throw new BadRequestException("Credentials invalid");

    const access_token = await this.encrypter.encrypt({
      sub: courier.id.toString(),
    });

    return { access_token };
  }
}
