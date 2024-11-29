import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

describe("login Organization (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it("should be able to login organization", async () => {
    await prisma.org.create({
      data: {
        city: "são paulo",
        state: "são paulo",
        email: "org@example.com",
        name_of_person_responsible: "john Doe",
        zip_code: "08000-000",
        phone: "(00) 00000-0000",
        street: "street",
        password_hash: await bcrypt.hash("123456", 7),
      },
    });

    const response = await request(app.server).post("/login").send({
      email: "org@example.com",
      password: "123456",
    });

    expect(response.body).toMatchObject({
      token: expect.any(String),
    });
  });
});
