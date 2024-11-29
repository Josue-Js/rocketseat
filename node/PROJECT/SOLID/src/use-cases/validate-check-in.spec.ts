import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInValidateUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./erros/resource-not-found-error";
import { LateCheckInValidationError } from "./erros/late-check-in-validation-error";

let checkInRepository: InMemoryCheckInRepository;
let stu: CheckInValidateUseCase;

describe("Check in Use Case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    stu = new CheckInValidateUseCase(checkInRepository);

    // await gymRepository.create({
    //   id: "gym-01",
    //   title: "gym",
    //   description: "",
    //   phone: "",
    //   latitude: -23.3216829,
    //   longitude: -51.2149845,
    // });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to validate the check in", async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const { checkIn } = await stu.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInRepository.checkIns[0].validated_at).toEqual(
      expect.any(Date)
    );
  });

  it("should not be able to validate an inexistent check-in", async () => {
    expect(
      async () =>
        await stu.execute({
          checkInId: "inexistent",
        })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to validate the check-in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const createdCheckIn = await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const twentyOneMinuteInMs = 1000 * 60 * 21;
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40)).advanceTimersByTime(
      twentyOneMinuteInMs
    );

    expect(
      async () =>
        await stu.execute({
          checkInId: createdCheckIn.id,
        })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
