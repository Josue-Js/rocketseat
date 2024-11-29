import { CheckIn, Prisma, User } from "@prisma/client";

export abstract class CheckInsRepository {
  abstract create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  abstract findByUserIdOnDate(
    userId: string,
    date: Date
  ): Promise<CheckIn | null>;
  abstract findManyByUserId(userId: string, page: number): Promise<CheckIn[]>;
  abstract countByUserId(userId: string): Promise<number>;
  abstract findById(id: string): Promise<CheckIn | null>;
  abstract update(check: CheckIn): Promise<CheckIn>;
}
