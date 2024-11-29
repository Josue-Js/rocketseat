import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInUseCase } from "./check-in";
import { MaxNumberOfCheckInsError } from "./erros/max-number-of-check-in-error";
import { MaxDistanceError } from "./erros/max-distance-error";

let gymRepository: InMemoryGymRepository;
let checkInRepository: InMemoryCheckInRepository;
let stu: CheckInUseCase;

describe("Check in Use Case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    gymRepository = new InMemoryGymRepository();
    stu = new CheckInUseCase(checkInRepository, gymRepository);

    vi.useFakeTimers();

    await gymRepository.create({
      id: "gym-01",
      title: "gym",
      description: "",
      phone: "",
      latitude: -23.3216829,
      longitude: -51.2149845,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await stu.execute({
      gymId: "gym-01",
      userId: "user-01",
      UserLatitude: -23.3216829,
      UserLongitude: -51.2149845,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await stu.execute({
      gymId: "gym-01",
      userId: "user-01",
      UserLatitude: -23.3216829,
      UserLongitude: -51.2149845,
    });

    await expect(
      async () =>
        await stu.execute({
          gymId: "gym-01",
          userId: "user-01",
          UserLatitude: -23.3216829,
          UserLongitude: -51.2149845,
        })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await stu.execute({
      gymId: "gym-01",
      userId: "user-01",
      UserLatitude: -23.3216829,
      UserLongitude: -51.2149845,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await stu.execute({
      gymId: "gym-01",
      userId: "user-01",
      UserLatitude: -23.3216829,
      UserLongitude: -51.2149845,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    gymRepository.gyms.push({
      id: "gym-02",
      title: "gym",
      description: "",
      phone: "",
      latitude: new Decimal(-23.3216829),
      longitude: new Decimal(-51.2149845),
    });

    expect(
      async () =>
        await stu.execute({
          gymId: "gym-01",
          userId: "user-01",
          UserLatitude: -24.3216829,
          UserLongitude: -52.2149845,
        })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
