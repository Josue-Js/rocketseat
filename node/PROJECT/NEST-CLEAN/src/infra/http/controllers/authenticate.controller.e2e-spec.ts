import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as bcryptjs from "bcryptjs";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";

let app: INestApplication;
let studentFactory: StudentFactory;

describe("Authenticate (E2E)", () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);

    await app.init();
  });

  test("[POST] /sessions", async () => {
    await studentFactory.makePrismaStudent({
      email: "john@example.com",
      password: await bcryptjs.hash("123456", 8),
    });

    const response = await request(app.getHttpServer()).post("/sessions").send({
      email: "john@example.com",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
