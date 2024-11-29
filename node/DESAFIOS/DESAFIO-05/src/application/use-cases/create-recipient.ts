import { ForbiddenException, Injectable } from "@nestjs/common";
import { Recipient } from "../entities/recipient";
import { RecipientRepository } from "../repositories/recipient-repository";
import { Role } from "@prisma/client";

interface CreateRecipientUseCaseRequest {
  name: string;
  city: string;
  state: string;
  neighbourhood: string;
  zip_code: string;
  address: string;
  number: number;
  complement: string | null;
  role: Role;
}

@Injectable()
export class CreateRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    name,
    city,
    state,
    zip_code,
    address,
    number,
    complement,
    neighbourhood,
    role,
  }: CreateRecipientUseCaseRequest): Promise<void> {
    if (role !== "ADMIN") throw new ForbiddenException();

    const recipient = Recipient.create({
      name,
      city,
      state,
      zip_code,
      address,
      number,
      complement,
      neighbourhood,
    });

    await this.recipientRepository.create(recipient);
  }
}
