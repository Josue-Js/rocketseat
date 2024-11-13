import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { AnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comment-repository";

export class InMemoryAnswerCommentRepository
  implements AnswerCommentRepository
{
  items: AnswerComment[] = [];

  async create(answerComment: AnswerComment): Promise<void> {
    this.items.push(answerComment);
  }

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id) ?? null;
    return answer;
  }

  async delete(answerCommentId: string) {
    this.items = this.items.filter(
      (item) => item.id.toString() != answerCommentId
    );
  }

  async findByManyByAnswerId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<AnswerComment[]> {
    const questionComments = this.items
      .filter((item) => item.answerId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }
}
