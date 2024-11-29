import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentRepository } from "@/domain/forum/application/repositories/question-comment-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/valueObject/commet-with-author";
import { InMemoryStudentRepository } from "./in-memory-student-repository";

export class InMemoryQuestionCommentRepository
  implements QuestionCommentRepository
{
  items: QuestionComment[] = [];

  constructor(private studentsRepository: InMemoryStudentRepository) {}

  async create(questionComment: QuestionComment): Promise<void> {
    this.items.push(questionComment);
  }

  async findById(id: string) {
    const questionComment =
      this.items.find((item) => item.id.toString() === id) ?? null;
    return questionComment;
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    this.items = this.items.filter((item) => !item.equals(questionComment));
  }

  async findByManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }

  async findByManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
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

    return questionComments;
  }
}
