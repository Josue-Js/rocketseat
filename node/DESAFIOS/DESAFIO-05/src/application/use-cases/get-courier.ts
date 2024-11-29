import { Injectable } from "@nestjs/common";
import { Courier } from "../entities/courier";
import { CourierRepository } from "../repositories/courier-repository";

interface GetCourierUseCaseRequest {
  courier_id: string;
}

type GetCourierUseCaseResponse = Courier;

@Injectable()
export class GetCourierUseCase {
  constructor(private courierRepository: CourierRepository) {}

  async execute({
    courier_id,
  }: GetCourierUseCaseRequest): Promise<GetCourierUseCaseResponse> {
    const courier = await this.courierRepository.findById(courier_id);

    if (!courier) {
      throw new Error("Courier not exist");
    }

    return courier;
  }
}
