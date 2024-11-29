import { OrderWithRecipient } from "@/application/entities/value-object/order-with-recipient";

export class OrderWithRecipientPresenter {
  static toHTTP(order: OrderWithRecipient) {
    return {
      courier_id: order.courier_id.toString(),
      status: order.status,
      collected_at: order.collected_at,
      delivered_at: order.delivered_at,
      posted_at: order.posted_at,
      recipient: {
        id: order.recipient_id.toString(),
        name: order.recipient_name,
        address: order.recipient_address,
        number: order.recipient_number,
        city: order.recipient_city,
        state: order.recipient_state,
        complement: order.recipient_complement,
        zip_code: order.recipient_zip_code,
      },
    };
  }
}
