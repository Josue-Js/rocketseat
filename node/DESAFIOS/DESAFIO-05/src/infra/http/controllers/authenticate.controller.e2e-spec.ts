import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as bcryptjs from "bcryptjs";
import request from "supertest";
import { CourierFactory } from "test/factories/make-courier";

let app: INestApplication;
let courierFactory: CourierFactory;

describe("Authenticate (E2E)", () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    courierFactory = moduleRef.get(CourierFactory);

    await app.init();
  });

  test("[POST] /sign-in", async () => {
    await courierFactory.makePrismaCourier({
      cpf: "12345678900",
      password: await bcryptjs.hash("123456", 8),
    });

    const response = await request(app.getHttpServer()).post("/sign-in").send({
      cpf: "12345678900",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
