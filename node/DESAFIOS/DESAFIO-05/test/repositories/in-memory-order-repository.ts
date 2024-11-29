import { Order } from "@/application/entities/order";
import { OrderWithRecipient } from "@/application/entities/value-object/order-with-recipient";

import { OrderRepository } from "@/application/repositories/order-repository";
import { RecipientRepository } from "@/application/repositories/recipient-repository";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { InMemoryRecipientRepository } from "./in-memory-recipient-repository";

export class InMemoryOrderRepository implements OrderRepository {
  public orders: Order[] = [];

  constructor(private recipientRepository: InMemoryRecipientRepository) {}

  async create(order: Order): Promise<void> {
    this.orders.push(order);
  }

  async findById(id: string): Promise<Order | null> {
    const order = this.orders.find((order) => order.id.toString() === id);

    if (!order) return null;

    return order;
  }

  async delete(id: string): Promise<void> {
    this.orders = this.orders.filter((order) => order.id.toString() !== id);
  }

  async update(order: Order): Promise<void> {
    this.orders = this.orders.map((item) =>
      item.id.equals(order.id) ? order : item,
    );
  }

  async findManyByCourierId(
    courier_id: string,
    { page }: PaginationParams,
    neighbourhood = "",
  ): Promise<OrderWithRecipient[]> {
    const orders = this.orders
      .filter((item) => item.courier_id.toString() === courier_id)
      .slice((page - 1) * 20, page * 20)
      .map((order) => {
        const recipient = this.recipientRepository.recipients.find(
          (recipient) => recipient.id.equals(order.recipient_id),
        );

        if (!recipient) throw Error("Recipient not Exist");

        return OrderWithRecipient.create({
          status: order.status,
          collected_at: order.collected_at,
          delivered_at: order.delivered_at,
          posted_at: order.posted_at,
          courier_id: order.courier_id,
          recipient: {
            id: recipient.id,
            address: recipient.address,
            number: recipient.number,
            neighbourhood: recipient.neighbourhood,
            city: recipient.city,
            name: recipient.name,
            state: recipient.state,
            complement: recipient.complement,

            zip_code: recipient.zip_code,
          },
        });
      })
      .filter((order) => order.recipient_neighbourhood.includes(neighbourhood));

    return orders;
  }
}
