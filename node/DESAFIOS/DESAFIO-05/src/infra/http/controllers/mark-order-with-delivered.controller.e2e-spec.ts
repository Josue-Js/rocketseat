import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachment";
import { CourierFactory } from "test/factories/make-courier";
import { OrderFactory } from "test/factories/make-order";
import { RecipientFactory } from "test/factories/make-recipient";

let app: INestApplication;
let prisma: PrismaService;
let jwt: JwtService;
let courierFactory: CourierFactory;
let recipientFactory: RecipientFactory;
let orderFactory: OrderFactory;
let attachmentFactory: AttachmentFactory;

describe("Mark Order As Delivered (E2E)", () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        CourierFactory,
        RecipientFactory,
        OrderFactory,
        AttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    courierFactory = moduleRef.get(CourierFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    orderFactory = moduleRef.get(OrderFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);

    await app.init();
  });

  test("[PUT] /order/:id/delivered", async () => {
    const courier = await courierFactory.makePrismaCourier({
      name: "John Doe",
      role: "ADMIN",
    });

    const accessToken = jwt.sign({ sub: courier.id.toString() });

    const recipient = await recipientFactory.makePrismaRecipient();

    const order = await orderFactory.makePrismaOrder({
      recipient_id: recipient.id,
      courier_id: courier.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    const response = await request(app.getHttpServer())
      .put(`/order/${order.id.toString()}/delivered`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        attachments: [attachment.id.toString()],
      });

    const orderOnDatabase = await prisma.order.findUnique({
      where: {
        id: order.id.toString(),
      },
    });

    expect(response.status).toBe(200);
    expect(orderOnDatabase).toMatchObject({
      status: "DELIVERED",
    });

    const attachmentOnDatabase = await prisma.attachment.findMany({
      where: {
        order_id: orderOnDatabase?.id,
      },
    });

    expect(attachmentOnDatabase).toHaveLength(1);
  });
});
