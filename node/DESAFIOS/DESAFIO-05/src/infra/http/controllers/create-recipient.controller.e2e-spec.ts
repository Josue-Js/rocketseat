import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { CourierFactory } from "test/factories/make-courier";

let app: INestApplication;
let prisma: PrismaService;
let jwt: JwtService;
let courierFactory: CourierFactory;

describe("Create Recipient (E2E)", () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    courierFactory = moduleRef.get(CourierFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[POST] /recipient", async () => {
    const courier = await courierFactory.makePrismaCourier({
      name: "John Doe",
      role: "ADMIN",
    });

    const accessToken = jwt.sign({ sub: courier.id.toString() });

    const response = await request(app.getHttpServer())
      .post("/recipient")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "John Doe",
        address: "street",
        city: "new york",
        complement: "house",
        number: 10,
        zip_code: "zip_code",
        state: "new york",
        neighbourhood: "neighbourhood",
      });

    const recipientOnDatabase = await prisma.recipient.findFirst({
      where: {
        name: "John Doe",
      },
    });

    expect(response.status).toBe(201);
    expect(recipientOnDatabase).toBeTruthy();
  });
});
