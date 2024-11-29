import { Courier } from "@/application/entities/courier";
import { CourierRepository } from "@/application/repositories/courier-repository";

export class InMemoryCourierRepository implements CourierRepository {
  public couriers: Courier[] = [];

  async create(courier: Courier): Promise<void> {
    this.couriers.push(courier);
  }

  async findByCpf(cpf: string): Promise<Courier | null> {
    const courier = this.couriers.find((courier) => courier.cpf === cpf);

    if (!courier) return null;

    return courier;
  }

  async findById(id: string): Promise<Courier | null> {
    const courier = this.couriers.find(
      (courier) => courier.id.toString() === id,
    );

    if (!courier) return null;

    return courier;
  }

  async update(courier: Courier): Promise<void> {
    this.couriers = this.couriers.map((item) =>
      item.id.equals(courier.id) ? courier : item,
    );
  }
  async delete(id: string): Promise<void> {
    this.couriers = this.couriers.filter((order) => order.id.toString() !== id);
  }
}
