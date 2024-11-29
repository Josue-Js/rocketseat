import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { CourierFactory } from "test/factories/make-courier";
import { RecipientFactory } from "test/factories/make-recipient";

let app: INestApplication;
let jwt: JwtService;
let courierFactory: CourierFactory;
let recipientFactory: RecipientFactory;

describe("Get Recipient (E2E)", () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory, RecipientFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    courierFactory = moduleRef.get(CourierFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /recipient", async () => {
    const courier = await courierFactory.makePrismaCourier({
      name: "John Doe",
    });
    const recipient = await recipientFactory.makePrismaRecipient({
      city: "city",
      state: "state",
    });

    const accessToken = jwt.sign({ sub: courier.id.toString() });

    const response = await request(app.getHttpServer())
      .get(`/recipient/${recipient.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: recipient.id.toString(),
      city: "city",
      state: "state",
    });
  });
});
