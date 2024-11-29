import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { SearchGymUseCase } from "./search-gym";

let gymRepository: InMemoryGymRepository;
let sut: SearchGymUseCase;

describe("Search Gym User Check-in History Use Case", () => {
  beforeEach(async () => {
    gymRepository = new InMemoryGymRepository();
    sut = new SearchGymUseCase(gymRepository);
  });

  it("should be able to search for gyms", async () => {
    await gymRepository.create({
      title: "JS",
      description: null,
      phone: "",
      latitude: -23.3216829,
      longitude: -51.2149845,
    });
    await gymRepository.create({
      title: "TS",
      description: null,
      phone: "",
      latitude: -23.3216829,
      longitude: -51.2149845,
    });
    const { gyms } = await sut.execute({ query: "JS", page: 1 });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "JS" })]);
  });

  it("should be able to fetch paginated gym search", async () => {
    [...Array(22)].forEach(async (_, index) => {
      await gymRepository.create({
        title: `gym-${index + 1}`,
        description: null,
        phone: "",
        latitude: -23.3216829,
        longitude: -51.2149845,
      });
    });

    const { gyms } = await sut.execute({
      query: "gym",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "gym-21" }),
      expect.objectContaining({ title: "gym-22" }),
    ]);
  });
});
