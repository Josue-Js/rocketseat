import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchMembersCheckInHistoryUseCase } from "./fetch-user-check-in-history";
import { aw } from "vitest/dist/chunks/reporters.DAfKSDh5";

let checkInRepository: InMemoryCheckInRepository;
let sut: FetchMembersCheckInHistoryUseCase;

describe("Fetch User Check-in History Use Case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new FetchMembersCheckInHistoryUseCase(checkInRepository);
  });

  it("should be able to fetch check-in history", async () => {
    await checkInRepository.create({
      user_id: "user-01",
      gym_id: "gym-01",
    });
    await checkInRepository.create({
      user_id: "user-01",
      gym_id: "gym-02",
    });
    const { checkIns } = await sut.execute({ userId: "user-01", page: 1 });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-01" }),
      expect.objectContaining({ gym_id: "gym-02" }),
    ]);
  });

  it("should be able to fetch paginated check in history", async () => {
    [...Array(22)].forEach(async (_, index) => {
      await checkInRepository.create({
        gym_id: `gym-${index + 1}`,
        user_id: "user-01",
      });
    });

    const { checkIns } = await sut.execute({
      userId: "user-01",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-21" }),
      expect.objectContaining({ gym_id: "gym-22" }),
    ]);
  });
});
