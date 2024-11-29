import { Recipient } from "@/application/entities/recipient";

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      address: recipient.address,
      number: recipient.number,
      city: recipient.city,
      state: recipient.state,
      zip_code: recipient.zip_code,
      complement: recipient.complement,
    };
  }
}
