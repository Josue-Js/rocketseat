import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { CourierFactory } from "test/factories/make-courier";
import { OrderFactory } from "test/factories/make-order";
import { makeRecipient, RecipientFactory } from "test/factories/make-recipient";

let app: INestApplication;
let jwt: JwtService;
let courierFactory: CourierFactory;
let orderFactory: OrderFactory;
let recipientFactory: RecipientFactory;

describe("Get Courier  (E2E)", () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory, OrderFactory, RecipientFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    courierFactory = moduleRef.get(CourierFactory);
    jwt = moduleRef.get(JwtService);
    orderFactory = moduleRef.get(OrderFactory);
    recipientFactory = moduleRef.get(RecipientFactory);

    await app.init();
  });

  test("[GET] /courier/orders", async () => {
    const courier = await courierFactory.makePrismaCourier({});
    const accessToken = jwt.sign({ sub: courier.id.toString() });

    const recipient1 = await recipientFactory.makePrismaRecipient({
      neighbourhood: "new york",
    });
    const recipient2 = await recipientFactory.makePrismaRecipient({
      neighbourhood: "another",
    });

    await orderFactory.makePrismaOrder({
      recipient_id: recipient1.id,
      courier_id: courier.id,
    });
    await orderFactory.makePrismaOrder({
      recipient_id: recipient2.id,
      courier_id: courier.id,
    });

    const response = await request(app.getHttpServer())
      .get("/courier/orders?neighbourhood=new")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });
});
