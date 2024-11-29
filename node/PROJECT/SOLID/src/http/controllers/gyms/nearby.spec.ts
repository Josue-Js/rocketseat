import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Nearby Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it("should be able  to list nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Typescript Gyms",
        description: "Some description",
        phone: "1199932312",
        latitude: -23.3216829,
        longitude: -51.2149845,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Javascript Gyms",
        description: "Some description",
        phone: "1199932312",
        latitude: -49.3216829,
        longitude: -59.2149845,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: -23.3216829,
        longitude: -51.2149845,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: "Typescript Gyms" }),
    ]);
  });
});
