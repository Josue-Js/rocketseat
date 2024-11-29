import { PaginationParams } from "@/core/repositories/pagination-params";
import { Order } from "../entities/order";
import { OrderWithRecipient } from "../entities/value-object/order-with-recipient";

export abstract class OrderRepository {
  abstract create(courier: Order): Promise<void>;
  abstract findById(cpf: string): Promise<Order | null>;
  abstract findManyByCourierId(
    courier_id: string,
    params: PaginationParams,
    neighbourhood?: string,
  ): Promise<OrderWithRecipient[]>;
  abstract delete(id: string): Promise<void>;
  abstract update(order: Order): Promise<void>;
}
