import { Injectable } from "@nestjs/common";
import { PrismaAttachmentMapper } from "../mappers/prisma-attachment-mappers";
import { PrismaService } from "../prisma.service";
import { Attachment } from "@/application/entities/attachment";
import { AttachmentsRepository } from "@/application/repositories/attachments-repository";

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(attachment);
    await this.prisma.attachment.create({ data });
  }
}
