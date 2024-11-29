import { ForbiddenException, Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
import { CourierRepository } from "../repositories/courier-repository";

interface DeleteCourierUseCaseRequest {
  role: Role;
  courier_id: string;
}

@Injectable()
export class DeleteCourierUseCase {
  constructor(private courierRepository: CourierRepository) {}

  async execute({
    courier_id,
    role,
  }: DeleteCourierUseCaseRequest): Promise<void> {
    if (role !== "ADMIN") throw new ForbiddenException();

    await this.courierRepository.delete(courier_id);
  }
}
