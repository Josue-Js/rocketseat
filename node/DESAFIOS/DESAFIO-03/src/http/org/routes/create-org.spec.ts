import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { prisma } from "@/lib/prisma";

describe("Create Organization (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it("should be able to create organization", async () => {
    const response = await request(app.server).post("/organization").send({
      city: "são paulo",
      state: "são paulo",
      email: "test@example.com",
      name_of_person_responsible: "john Doe",
      zip_code: "08000-000",
      phone: "(00) 00000-0000",
      street: "street",
      password: "123456",
    });

    expect(response.statusCode).toEqual(201);
  });
});
