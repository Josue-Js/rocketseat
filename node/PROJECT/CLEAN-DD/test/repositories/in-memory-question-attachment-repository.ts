import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachment-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionAttachmentRepository
  implements QuestionAttachmentRepository
{
  items: QuestionAttachment[] = [];

  async findByManyByQuestionId(
    questionId: string
  ): Promise<QuestionAttachment[]> {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() === questionId
    );

    return questionAttachments;
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    this.items = this.items.filter(
      (item) => item.questionId.toString() !== questionId
    );
  }
}
