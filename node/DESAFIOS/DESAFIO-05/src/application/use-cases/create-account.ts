import { ConflictException, Injectable } from "@nestjs/common";
import { HashGenerator } from "../cryptography/hash-generator";
import { Courier } from "../entities/courier";
import { CourierRepository } from "../repositories/courier-repository";

interface CreateAccountUseCaseRequest {
  name: string;
  cpf: string;
  password: string;
}

type CreateAccountUseCaseResponse = null;

@Injectable()
export class CreateAccountUseCase {
  constructor(
    private courierRepository: CourierRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
  }: CreateAccountUseCaseRequest): Promise<CreateAccountUseCaseResponse> {
    const courierWithSameCpf = await this.courierRepository.findByCpf(cpf);

    if (courierWithSameCpf) throw new ConflictException();

    const password_hash = await this.hashGenerator.hash(password);

    const courier = Courier.create({
      name,
      cpf,
      password: password_hash,
    });

    await this.courierRepository.create(courier);

    return null;
  }
}
