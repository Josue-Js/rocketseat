import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentRepository } from "@/domain/forum/application/repositories/question-comment-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/valueObject/commet-with-author";
import { Injectable } from "@nestjs/common";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma-comment-with-author-mapper";
import { PrismaQuestionCommentMapper } from "../mappers/prisma-question-comment-mappers";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentRepository
{
  constructor(private prisma: PrismaService) {}

  async create(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment);
    await this.prisma.comment.create({ data });
  }

  async findById(questionId: string): Promise<QuestionComment | null> {
    const questionComment = await this.prisma.comment.findUnique({
      where: { id: questionId },
    });

    if (!questionComment) return null;

    return PrismaQuestionCommentMapper.toDomain(questionComment);
  }

  async findByManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionComments = await this.prisma.comment.findMany({
      where: { question_id: questionId },
      orderBy: {
        created_at: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return questionComments.map(PrismaQuestionCommentMapper.toDomain);
  }

  async findByManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const commentWithAuthor = await this.prisma.comment.findMany({
      where: { question_id: questionId },
      include: {
        author: true,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return commentWithAuthor.map(PrismaCommentWithAuthorMapper.toDomain);
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: { id: questionComment.id.toString() },
    });
  }
}
