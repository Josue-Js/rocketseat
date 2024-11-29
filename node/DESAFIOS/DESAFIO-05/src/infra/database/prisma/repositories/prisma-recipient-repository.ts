import { Recipient } from "@/application/entities/recipient";

import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";

import { RecipientRepository } from "@/application/repositories/recipient-repository";
import { PrismaRecipientMapper } from "../mappers/prisma-recipient-mapper";

@Injectable()
export class PrismaRecipientRepository implements RecipientRepository {
  constructor(private prisma: PrismaService) {}

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient);
    await this.prisma.recipient.create({ data });
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({ where: { id } });

    if (!recipient) return null;

    return PrismaRecipientMapper.toDomain(recipient);
  }

  async update(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient);

    await this.prisma.recipient.update({
      where: { id: data.id },
      data,
    });
  }

  async delete(recipient: Recipient): Promise<void> {
    await this.prisma.recipient.delete({
      where: { id: recipient.id.toString() },
    });
  }
}
