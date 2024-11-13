import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";

export abstract class QuestionAttachmentRepository {
  abstract findByManyByQuestionId(
    questionId: string
  ): Promise<QuestionAttachment[]>;
  abstract deleteManyByQuestionId(questionId: string): Promise<void>;
}
