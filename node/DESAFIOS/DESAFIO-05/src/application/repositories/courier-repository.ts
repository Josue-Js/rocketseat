import { Courier } from "../entities/courier";

export abstract class CourierRepository {
  abstract create(courier: Courier): Promise<void>;
  abstract findByCpf(cpf: string): Promise<Courier | null>;
  abstract findById(id: string): Promise<Courier | null>;
  abstract update(courier: Courier): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
