import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Recipient } from "../entities/recipient";
import { RecipientRepository } from "../repositories/recipient-repository";
import { Role } from "@prisma/client";

interface DeleteRecipientUseCaseRequest {
  recipient_id: string;
  role: Role;
}

@Injectable()
export class DeleteRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    recipient_id,
    role,
  }: DeleteRecipientUseCaseRequest): Promise<void> {
    if (role !== "ADMIN") throw new ForbiddenException();

    const recipient = await this.recipientRepository.findById(recipient_id);

    if (!recipient) throw new BadRequestException("recipient not exist");

    await this.recipientRepository.delete(recipient);
  }
}
