import { makeAnswer } from "test/factories/make-answer";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { InMemoryNotificationRepository } from "test/repositories/in-memory-notification-repository";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { waitFor } from "test/utils/wait-for";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { OnQuestionBestAnswerChosen } from "./on-question-best-answer-chosen";

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: any;

describe("On Question Best Answer Chosen", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository
    );

    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository
    );

    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");
    new OnQuestionBestAnswerChosen(
      inMemoryAnswerRepository,
      sendNotificationUseCase
    );
  });
  it("should send a notification when question has new best answer chosen", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: question.id,
    });

    inMemoryQuestionRepository.create(question);
    inMemoryAnswerRepository.create(answer);

    question.bestAnswerId = answer.id;

    inMemoryQuestionRepository.update(question);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});