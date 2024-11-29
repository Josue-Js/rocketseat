import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateGymUseCase } from "./create-gym";
import { Decimal } from "@prisma/client/runtime/library";

let gymRepository: InMemoryGymRepository;
let stu: CreateGymUseCase;

describe("Gym Use Case", () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymRepository();
    stu = new CreateGymUseCase(gymRepository);
  });

  it("should be able to register", async () => {
    const { gym } = await stu.execute({
      title: "JS",
      description: null,
      phone: "",
      latitude: -23.3216829,
      longitude: -51.2149845,
    });
    expect(gym.id).toEqual(expect.any(String));
  });
});
