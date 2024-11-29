import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { CourierFactory } from "test/factories/make-courier";
import { OrderFactory } from "test/factories/make-order";
import { RecipientFactory } from "test/factories/make-recipient";

let app: INestApplication;
let prisma: PrismaService;
let jwt: JwtService;
let courierFactory: CourierFactory;
let recipientFactory: RecipientFactory;
let orderFactory: OrderFactory;

describe("Delete Order (E2E)", () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory, RecipientFactory, OrderFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    courierFactory = moduleRef.get(CourierFactory);
    orderFactory = moduleRef.get(OrderFactory);
    recipientFactory = moduleRef.get(RecipientFactory);

    await app.init();
  });

  test("[Delete] /order/:id", async () => {
    const courier = await courierFactory.makePrismaCourier({
      name: "John Doe",
      role: "ADMIN",
    });
    const recipient = await recipientFactory.makePrismaRecipient();

    const order = await orderFactory.makePrismaOrder({
      courier_id: courier.id,
      recipient_id: recipient.id,
    });

    const accessToken = jwt.sign({ sub: courier.id.toString() });

    const response = await request(app.getHttpServer())
      .delete(`/order/${order.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        id: order.id.toString(),
      },
    });

    expect(response.status).toBe(204);
    expect(orderOnDatabase).not.toBeTruthy();
  });
});
