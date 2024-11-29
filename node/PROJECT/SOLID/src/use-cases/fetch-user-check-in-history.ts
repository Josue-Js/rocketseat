import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";

interface FetchMembersCheckInHistoryUseCaseRequest {
  userId: string;
  page: number;
}
interface FetchMembersCheckInHistoryUseCaseResponse {
  checkIns: CheckIn[];
}

export class FetchMembersCheckInHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchMembersCheckInHistoryUseCaseRequest): Promise<FetchMembersCheckInHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page
    );

    return {
      checkIns,
    };
  }
}
