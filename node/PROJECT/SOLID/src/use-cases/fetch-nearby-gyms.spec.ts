import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { SearchGymUseCase } from "./search-gym";
import { FetchNearByUseCase } from "./fetch-nearby-gyms";

let gymRepository: InMemoryGymRepository;
let sut: FetchNearByUseCase;

describe("Fetch nearby Gym Use Case", () => {
  beforeEach(async () => {
    gymRepository = new InMemoryGymRepository();
    sut = new FetchNearByUseCase(gymRepository);
  });

  it("should able fetch near gym", async () => {
    await gymRepository.create({
      title: "NEAR GYM",
      description: null,
      phone: "",
      latitude: -23.3216829,
      longitude: -51.2149845,
    });
    await gymRepository.create({
      title: "FAR GYM",
      description: null,
      phone: "",
      latitude: -49.3216829,
      longitude: -59.2149845,
    });

    const { gyms } = await sut.execute({
      userLatitude: -23.3216829,
      userLongitude: -51.2149845,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "NEAR GYM" })]);
  });
});
