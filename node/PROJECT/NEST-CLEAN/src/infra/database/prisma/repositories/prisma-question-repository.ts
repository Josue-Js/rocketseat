import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachment-repository";
import { QuestionRepository } from "@/domain/forum/application/repositories/question-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/valueObject/question-details";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { Injectable } from "@nestjs/common";
import { PrismaQuestionDetailsMapper } from "../mappers/prisma-question-details-mapper";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mappers";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaQuestionRepository implements QuestionRepository {
  constructor(
    private prisma: PrismaService,
    private questionAttachmentRepository: QuestionAttachmentRepository,
    private cache: CacheRepository,
  ) {}

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({ where: { slug } });

    if (!question) return null;

    return PrismaQuestionMapper.toDomain(question);
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const cacheHit = await this.cache.get(`question:${slug}:details`);

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit);
      return PrismaQuestionDetailsMapper.toDomain(cacheData);
    }

    const question = await this.prisma.question.findUnique({
      where: { slug },
      include: {
        author: true,
        attachments: true,
      },
    });

    if (!question) return null;

    this.cache.set(`question:${slug}:details`, JSON.stringify(question));

    const questionDetails = PrismaQuestionDetailsMapper.toDomain(question);

    return questionDetails;
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await this.prisma.question.create({
      data,
    });

    await this.questionAttachmentRepository.createMany(
      question.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!question) return null;

    return PrismaQuestionMapper.toDomain(question);
  }

  async findManyRecent(params: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      take: 20,
      skip: (params.page - 1) * 20,
      orderBy: {
        created_at: "desc",
      },
    });

    return questions.map(PrismaQuestionMapper.toDomain);
  }

  async delete(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await this.prisma.question.delete({
      where: { id: data.id },
    });

    await this.questionAttachmentRepository.deleteMany(
      question.attachments.getRemovedItems(),
    );
  }

  async update(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    Promise.all([
      await this.prisma.question.update({
        where: {
          id: question.id.toString(),
        },
        data,
      }),

      await this.questionAttachmentRepository.createMany(
        question.attachments.getNewItems(),
      ),
      await this.questionAttachmentRepository.deleteMany(
        question.attachments.getRemovedItems(),
      ),
      await this.cache.delete(`question:${data.slug}:details`),
    ]);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }
}
