import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

describe("Get Pet (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it("should be able to get pet", async () => {
    const org = await prisma.org.create({
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
    const pet = await prisma.pet.create({
      data: {
        name: "BOB",
        about: "cutie dog",
        age: "PUPPY",
        energia: "LAZY",
        environment: "LITTLE",
        level_of_independence: "MEDIUM",
        org_id: org.id,
        size: "SHORT",
        requirements: [],
      },
    });

    const response = await request(app.server).get(`/pet/${pet.id}`).send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.pet).toMatchObject({
      name: "BOB",
      about: "cutie dog",
      age: "PUPPY",
      energia: "LAZY",
      environment: "LITTLE",
      level_of_independence: "MEDIUM",
      org_id: org.id,
      size: "SHORT",
    });
  });
});
