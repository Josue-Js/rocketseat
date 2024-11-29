import { Courier } from "@/application/entities/courier";
import { CourierRepository } from "@/application/repositories/courier-repository";
import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { PrismaCourierMapper } from "../mappers/prisma-courier-mapper";

@Injectable()
export class PrismaCourierRepository implements CourierRepository {
  constructor(private prisma: PrismaService) {}

  async create(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrisma(courier);
    await this.prisma.courier.create({ data });
  }

  async findByCpf(cpf: string): Promise<Courier | null> {
    const courier = await this.prisma.courier.findUnique({ where: { cpf } });

    if (!courier) return null;

    return PrismaCourierMapper.toDomain(courier);
  }

  async findById(id: string): Promise<Courier | null> {
    const courier = await this.prisma.courier.findUnique({ where: { id } });

    if (!courier) return null;
    return PrismaCourierMapper.toDomain(courier);
  }

  async update(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrisma(courier);
    await this.prisma.courier.update({
      where: {
        id: courier.id.toString(),
      },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.courier.delete({ where: { id } });
  }
}
