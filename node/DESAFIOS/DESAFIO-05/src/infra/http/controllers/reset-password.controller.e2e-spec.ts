import { HashGenerator } from "@/application/cryptography/hash-generator";
import { AppModule } from "@/infra/app.module";
import { BcryptHasher } from "@/infra/cryptography/bcrypt-hasher";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
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
let bcryptHasher: BcryptHasher;

describe("Reset password (E2E)", () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [CourierFactory, RecipientFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    courierFactory = moduleRef.get(CourierFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    bcryptHasher = moduleRef.get(HashGenerator);

    await app.init();
  });

  test("[POST] /reset/password/:id", async () => {
    const courier1 = await courierFactory.makePrismaCourier({
      name: "Admin",
      role: "ADMIN",
    });

    const courier2 = await courierFactory.makePrismaCourier({
      name: "John Doe",
      password: await bcryptHasher.hash("000000"),
    });

    const accessToken = jwt.sign({ sub: courier1.id.toString() });

    const response = await request(app.getHttpServer())
      .put(`/reset/password/${courier2.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        new_password: "123456",
      });

    const courierOnDatabase = await prisma.courier.findUnique({
      where: {
        id: courier2.id.toString(),
      },
    });

    if (!courierOnDatabase) {
      throw new Error("Courier not exist");
    }

    expect(response.status).toBe(200);
    const password_is_valid = await bcryptHasher.compare(
      "123456",
      courierOnDatabase.password_hash,
    );
    await expect(password_is_valid).toEqual(true);
  });
});
