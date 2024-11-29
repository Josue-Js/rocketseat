import { QuestionDetails } from "@/domain/forum/enterprise/entities/valueObject/question-details";
import { AttachmentPresenter } from "./attachment-presenter";

export class QuestionDetailsPresenter {
  static toHTTP(questionDetails: QuestionDetails) {
    return {
      question: questionDetails.questionId,
      authorId: questionDetails.authorId,
      author: questionDetails.author,
      title: questionDetails.title,
      slug: questionDetails.slug,
      content: questionDetails.content,
      best_answer_id: questionDetails.bestAnswerId?.toString(),
      attachments: questionDetails.attachments.map(AttachmentPresenter.toHTTP),
      created_at: questionDetails.createdAt,
      updated_at: questionDetails.updatedAt,
    };
  }
}
