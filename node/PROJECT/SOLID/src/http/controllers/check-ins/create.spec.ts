import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Create CheckIn (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it("should be able to create checkIn", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const gym = await prisma.gym.create({
      data: {
        title: "Javascript Gym",
        latitude: -23.3216829,
        longitude: -51.2149845,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -23.3216829,
        longitude: -51.2149845,
      });

    expect(response.statusCode).toEqual(201);
  });
});
