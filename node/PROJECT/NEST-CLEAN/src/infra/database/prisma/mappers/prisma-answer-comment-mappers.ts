import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Prisma, Comment as PrismaAnswerComment } from "@prisma/client";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaAnswerComment): AnswerComment {
    if (!raw.answer_id) {
      throw new Error("Invalid comment type.");
    }

    return AnswerComment.create(
      {
        content: raw.content,
        answerId: new UniqueEntityID(raw.answer_id),
        authorId: new UniqueEntityID(raw.author_id),
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(
    answerComment: AnswerComment
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: answerComment.id.toString(),
      content: answerComment.content,
      author_id: answerComment.authorId.toString(),
      answer_id: answerComment.answerId.toString(),
      created_at: answerComment.createdAt,
      updated_at: answerComment.updatedAt,
    };
  }
}
