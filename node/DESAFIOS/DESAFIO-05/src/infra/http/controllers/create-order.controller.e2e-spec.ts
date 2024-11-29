import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { CourierFactory } from "test/factories/make-courier";
import { RecipientFactory } from "test/factories/make-recipient";

let app: INestApplication;
let prisma: PrismaService;
let jwt: JwtService;
let courierFactory: CourierFactory;
let recipientFactory: RecipientFactory;

describe("Create Order (E2E)", () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory, RecipientFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    courierFactory = moduleRef.get(CourierFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[POST] /recipient", async () => {
    const courier = await courierFactory.makePrismaCourier({
      role: "ADMIN",
    });
    const recipient = await recipientFactory.makePrismaRecipient();

    const accessToken = jwt.sign({ sub: courier.id.toString() });

    const response = await request(app.getHttpServer())
      .post("/order")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        courier_id: courier.id.toString(),
        recipient_id: recipient.id.toString(),
      });

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        courier_id: courier.id.toString(),
        recipient_id: recipient.id.toString(),
      },
    });

    expect(response.status).toBe(201);
    expect(orderOnDatabase).toBeTruthy();
  });
});
