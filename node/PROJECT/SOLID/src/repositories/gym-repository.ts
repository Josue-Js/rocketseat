import { Gym, Prisma } from "@prisma/client";

export interface FindManyNearByParmas {
  latitude: number;
  longitude: number;
}

export abstract class GymRepository {
  abstract findById(id: string): Promise<Gym | null>;
  abstract create(data: Prisma.GymCreateInput): Promise<Gym>;
  abstract searchMany(query: string, page: number): Promise<Gym[]>;
  abstract findManyNearBy(params: FindManyNearByParmas): Promise<Gym[]>;
}
