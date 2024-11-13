import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentRepository } from "@/domain/forum/application/repositories/question-comment-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

export class InMemoryQuestionCommentRepository
  implements QuestionCommentRepository
{
  items: QuestionComment[] = [];

  async create(questionComment: QuestionComment): Promise<void> {
    this.items.push(questionComment);
  }

  async findById(id: string) {
    const questionComment =
      this.items.find((item) => item.id.toString() === id) ?? null;
    return questionComment;
  }

  async delete(questionId: string): Promise<void> {
    this.items = this.items.filter((item) => item.id.toString() !== questionId);
  }

  async findByManyByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<QuestionComment[]> {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }
}
