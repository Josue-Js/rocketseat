import { Recipient } from "@/application/entities/recipient";
import { RecipientRepository } from "@/application/repositories/recipient-repository";

export class InMemoryRecipientRepository implements RecipientRepository {
  public recipients: Recipient[] = [];

  async create(recipient: Recipient): Promise<void> {
    this.recipients.push(recipient);
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = this.recipients.find(
      (recipient) => recipient.id.toString() === id,
    );

    if (!recipient) return null;

    return recipient;
  }

  async update(recipient: Recipient): Promise<void> {
    this.recipients = this.recipients.filter((item) =>
      item.id.equals(recipient.id) ? recipient : item,
    );
  }

  async delete(recipient: Recipient): Promise<void> {
    this.recipients = this.recipients.filter(
      (item) => !item.id.equals(recipient.id),
    );
  }
}
