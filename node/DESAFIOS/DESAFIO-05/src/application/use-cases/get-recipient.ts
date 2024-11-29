import { Injectable } from "@nestjs/common";
import { Recipient } from "../entities/recipient";
import { RecipientRepository } from "../repositories/recipient-repository";

interface GetRecipientUseCaseRequest {
  recipient_id: string;
}

type GetRecipientUseCaseResponse = Recipient;

@Injectable()
export class GetRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    recipient_id,
  }: GetRecipientUseCaseRequest): Promise<GetRecipientUseCaseResponse> {
    const recipient = await this.recipientRepository.findById(recipient_id);

    if (!recipient) {
      throw new Error("Recipient not exist");
    }

    return recipient;
  }
}
