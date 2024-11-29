import { prisma } from "@/lib/prisma";
import { CheckIn, Gym, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import dayjs from "dayjs";
import { FindManyNearByParmas, GymRepository } from "../gym-repository";

export class PrismaGymRepository implements GymRepository {
  async findById(id: string) {
    const gym = prisma.gym.findUnique({ where: { id } });
    return gym;
  }
  async create(data: Prisma.GymCreateInput) {
    const gym = prisma.gym.create({ data });
    return gym;
  }
  async searchMany(query: string, page: number) {
    const gym = prisma.gym.findMany({
      where: { title: { contains: query } },
      take: 20,
      skip: (page - 1) * 20,
    });
    return gym;
  }

  async findManyNearBy({ latitude, longitude }: FindManyNearByParmas) {
    const gyms = await prisma.$queryRaw<Gym[]>`
        SELECT * FROM gyms 
        WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;
    return gyms;
  }
}
