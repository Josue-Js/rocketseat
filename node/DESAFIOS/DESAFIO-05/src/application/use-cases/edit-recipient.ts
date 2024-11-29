import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Recipient } from "../entities/recipient";
import { RecipientRepository } from "../repositories/recipient-repository";
import { Role } from "@prisma/client";

interface EditRecipientUseCaseRequest {
  recipient_id: string;
  name?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  address?: string;
  number?: number;
  complement?: string | null;
  role: Role;
}

@Injectable()
export class EditRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    recipient_id,
    name,
    city,
    state,
    zip_code,
    address,
    number,
    complement,
    role,
  }: EditRecipientUseCaseRequest): Promise<void> {
    const recipient = await this.recipientRepository.findById(recipient_id);

    if (role !== "ADMIN") throw new ForbiddenException();
    if (!recipient) throw new BadRequestException();

    recipient.name = name ?? recipient.name;
    recipient.city = city ?? recipient.city;
    recipient.state = state ?? recipient.state;
    recipient.zip_code = zip_code ?? recipient.zip_code;
    recipient.address = address ?? recipient.address;
    recipient.number = number ?? recipient.number;
    recipient.complement = complement ?? recipient.complement;

    await this.recipientRepository.update(recipient);
  }
}
