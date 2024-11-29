import { CheckIn, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { CheckInsRepository } from "../check-ins-repository";
import dayjs from "dayjs";

export class InMemoryCheckInRepository implements CheckInsRepository {
  checkIns: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      created_at: new Date(),
      validated_at: data.validated_at
        ? new Date(data.validated_at)
        : new Date(),
      user_id: data.user_id,
      gym_id: data.gym_id,
    };
    this.checkIns.push(checkIn);

    return checkIn;
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkInOnSameDay =
      this.checkIns.find((checkIn) => {
        const checkInDate = dayjs(checkIn.created_at);
        const isOnSameDate =
          checkInDate.isAfter(startOfTheDay) &&
          checkInDate.isBefore(endOfTheDay);

        return checkIn.user_id == userId && isOnSameDate;
      }) || null;

    return checkInOnSameDay;
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIns = this.checkIns
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20);

    return checkIns;
  }

  async countByUserId(userId: string): Promise<number> {
    const checkIns = this.checkIns.filter(
      (checkIn) => checkIn.user_id === userId
    );

    return checkIns.length;
  }

  async findById(id: string): Promise<CheckIn | null> {
    const checkIns = this.checkIns.find((checkIn) => checkIn.id === id) || null;
    return checkIns;
  }

  async update(checkIn: CheckIn): Promise<CheckIn> {
    this.checkIns.filter((item) => (item.id === checkIn.id ? checkIn : item));

    return checkIn;
  }
}
