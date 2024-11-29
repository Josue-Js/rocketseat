import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

let app: INestApplication;
let prisma: PrismaService;

describe("Create Account (E2E)", () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test("[POST] /sign-up", async () => {
    const response = await request(app.getHttpServer()).post("/sign-up").send({
      name: "John Doe",
      cpf: "123.456.789-00",
      password: "123456",
    });

    const courierOnDatabase = await prisma.courier.findUnique({
      where: {
        cpf: "12345678900",
      },
    });

    expect(response.status).toBe(201);
    expect(courierOnDatabase).toBeTruthy();
  });
});
