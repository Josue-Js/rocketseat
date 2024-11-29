import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comment-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/valueObject/commet-with-author";
import { InMemoryStudentRepository } from "./in-memory-student-repository";

export class InMemoryAnswerCommentRepository
  implements AnswerCommentRepository
{
  items: AnswerComment[] = [];

  constructor(private studentsRepository: InMemoryStudentRepository) {}

  async create(answerComment: AnswerComment): Promise<void> {
    this.items.push(answerComment);
  }

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id) ?? null;
    return answer;
  }

  async delete(answerComment: AnswerComment) {
    this.items = this.items.filter(
      (item) => item.id.toString() !== answerComment.id.toString(),
    );
  }

  async findByManyByAnswerId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const questionComments = this.items
      .filter((item) => item.answerId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }

  async findByManyByAnswerIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) =>
          student.id.equals(comment.authorId),
        );

        if (!author) {
          throw Error(
            `Author with ID "${comment.authorId.toString()}" does not exist`,
          );
        }

        return CommentWithAuthor.create({
          content: comment.content,
          commentId: comment.id,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: author.id,
          author: author.name,
        });
      });

    return answerComments;
  }
}
