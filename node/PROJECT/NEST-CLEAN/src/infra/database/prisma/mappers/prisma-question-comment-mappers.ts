import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Prisma, Comment as PrismaQuestionComment } from "@prisma/client";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

export class PrismaQuestionCommentMapper {
  static toDomain(raw: PrismaQuestionComment): QuestionComment {
    if (!raw.question_id) {
      throw new Error("Invalid comment type.");
    }

    return QuestionComment.create(
      {
        content: raw.content,
        questionId: new UniqueEntityID(raw.question_id),
        authorId: new UniqueEntityID(raw.author_id),
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(
    questionComment: QuestionComment
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: questionComment.id.toString(),
      content: questionComment.content,
      author_id: questionComment.authorId.toString(),
      question_id: questionComment.questionId.toString(),
      created_at: questionComment.createdAt,
      updated_at: questionComment.updatedAt,
    };
  }
}
