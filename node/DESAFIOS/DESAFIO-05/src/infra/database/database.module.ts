import { CourierRepository } from "@/application/repositories/courier-repository";
import { Module } from "@nestjs/common";
import { PrismaCourierRepository } from "./prisma/repositories/prisma-courier-repository";
import { PrismaService } from "./prisma/prisma.service";
import { RecipientRepository } from "@/application/repositories/recipient-repository";
import { PrismaRecipientRepository } from "./prisma/repositories/prisma-recipient-repository";
import { OrderRepository } from "@/application/repositories/order-repository";
import { PrismaOrderRepository } from "./prisma/repositories/prisma-order-repository";
import { AttachmentsRepository } from "@/application/repositories/attachments-repository";
import { PrismaAttachmentsRepository } from "./prisma/repositories/prisma-attachments-repository";
import { OrderAttachmentRepository } from "@/application/repositories/order-attachment-repository";
import { PrismaOrderAttachmentsRepository } from "./prisma/repositories/prisma-order-attachments-repository";

@Module({
  providers: [
    PrismaService,
    {
      provide: CourierRepository,
      useClass: PrismaCourierRepository,
    },
    {
      provide: RecipientRepository,
      useClass: PrismaRecipientRepository,
    },
    {
      provide: OrderRepository,
      useClass: PrismaOrderRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: OrderAttachmentRepository,
      useClass: PrismaOrderAttachmentsRepository,
    },
  ],
  exports: [
    PrismaService,
    CourierRepository,
    RecipientRepository,
    OrderRepository,
    AttachmentsRepository,
    OrderAttachmentRepository,
  ],
})
export class DatabaseModule {}
