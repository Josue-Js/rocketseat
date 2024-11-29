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

  test("[POST] /accounts", async () => {
    const response = await request(app.getHttpServer()).post("/accounts").send({
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
    });

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: "john@example.com",
      },
    });

    expect(response.status).toBe(201);
    expect(userOnDatabase).toBeTruthy();
  });
});
