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

describe("Delete Recipient (E2E)", () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory, RecipientFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    courierFactory = moduleRef.get(CourierFactory);
    recipientFactory = moduleRef.get(RecipientFactory);

    await app.init();
  });

  test("[Delete] /recipient/:id", async () => {
    const courier = await courierFactory.makePrismaCourier({
      name: "John Doe",
      role: "ADMIN",
    });

    const accessToken = jwt.sign({ sub: courier.id.toString() });

    const recipient = await recipientFactory.makePrismaRecipient({
      number: 10,
    });

    const response = await request(app.getHttpServer())
      .delete(`/recipient/${recipient.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    const recipientOnDatabase = await prisma.recipient.findFirst({
      where: {
        id: recipient.id.toString(),
      },
    });

    expect(response.status).toBe(204);
    expect(recipientOnDatabase).not.toBeTruthy();
  });
});
