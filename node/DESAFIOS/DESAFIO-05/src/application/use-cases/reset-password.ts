import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Role } from "@prisma/client";
import { HashGenerator } from "../cryptography/hash-generator";
import { CourierRepository } from "../repositories/courier-repository";

interface ResetPasswordUseCaseRequest {
  courier_id: string;
  role: Role;
  new_password: string;
}

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private courierRepository: CourierRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    courier_id,
    role,
    new_password,
  }: ResetPasswordUseCaseRequest): Promise<void> {
    if (role !== "ADMIN") throw new ForbiddenException();

    const courier = await this.courierRepository.findById(courier_id);

    if (!courier) throw new BadRequestException("Courier not exist");

    const password_hash = await this.hashGenerator.hash(new_password);

    courier.password = password_hash;

    await this.courierRepository.update(courier);
  }
}
