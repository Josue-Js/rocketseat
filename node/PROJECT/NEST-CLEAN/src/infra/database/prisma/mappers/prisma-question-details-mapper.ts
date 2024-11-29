import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/valueObject/question-details";
import { Slug } from "@/domain/forum/enterprise/entities/valueObject/slug";
import {
  Attachment as PrismaAttachment,
  Question as PrismaQuestion,
  User as PrismaUser,
} from "@prisma/client";
import { PrismaAttachmentMapper } from "./prisma-attachment-mappers";

type PrismaQuestionDetails = PrismaQuestion & {
  author: PrismaUser;
  attachments: PrismaAttachment[];
};

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      questionId: new UniqueEntityID(raw.id),
      authorId: new UniqueEntityID(raw.author_id),
      content: raw.content,
      author: raw.author.name,
      title: raw.title,
      slug: Slug.create(raw.slug),
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      bestAnswerId: raw.best_answer_id
        ? new UniqueEntityID(raw.best_answer_id)
        : null,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    });
  }
}
