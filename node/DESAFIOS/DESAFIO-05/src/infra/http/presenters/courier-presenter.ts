import { Courier } from "@/application/entities/courier";

export class CourierPresenter {
  static toHTTP(courier: Courier) {
    return {
      id: courier.id.toString(),
      name: courier.name,
      role: courier.role,
    };
  }
}
