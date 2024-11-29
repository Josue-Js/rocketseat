import { Recipient } from "../entities/recipient";

export abstract class RecipientRepository {
  abstract create(recipient: Recipient): Promise<void>;
  abstract findById(id: string): Promise<Recipient | null>;
  abstract update(recipient: Recipient): Promise<void>;
  abstract delete(recipient: Recipient): Promise<void>;
}
