import { Either, left, right } from "@/core/either";
import { AnswerRepository } from "../repositories/answer-repository";
import { Answer } from "../../enterprise/entities/answer";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerAttachmentRepository } from "../repositories/answer-attachment-repository";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";

interface EditAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
  content: string;
  attachmentsIds: string[];
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { answer: Answer }
>;

export class EditAnswerUseCase {
  constructor(
    private answerRepository: AnswerRepository,
    private answerAttachmentRepository: AnswerAttachmentRepository
  ) {}

  async execute({
    answerId,
    authorId,
    content,
    attachmentsIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId != answer.authorId.toString()) {
      return left(new NotAllowedError());
    }

    const currentAnswerAttachment =
      await this.answerAttachmentRepository.findByManyByAnswerId(answerId);

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachment
    );

    const answerAttachment = attachmentsIds.map((attachmentId) =>
      AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      })
    );

    answerAttachmentList.update(answerAttachment);

    answer.attachments = answerAttachmentList;
    answer.content = content;

    await this.answerRepository.update(answer);

    return right({ answer });
  }
}
