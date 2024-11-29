import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";

export abstract class AnswerAttachmentRepository {
  abstract createMany(attachment: AnswerAttachment[]): Promise<void>;
  abstract deleteMany(attachment: AnswerAttachment[]): Promise<void>;
  abstract findByManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
  abstract deleteManyByAnswerId(answerId: string): Promise<void>;
}
