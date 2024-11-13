import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "test/factories/make-answer";
import { makeQuestion } from "test/factories/make-question";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe("Choose question best Answer Use Case", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository
    );

    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository
    );

    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryQuestionRepository
    );
  });

  it("should be able to choose the question best answer", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: question.id,
    });
    await inMemoryQuestionRepository.create(question);
    await inMemoryAnswerRepository.create(answer);
    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });
    expect(inMemoryQuestionRepository.items[0].bestAnswerId).toEqual(answer.id);
  });

  it("should not be able to to choose another user question best answer", async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityID("author-1"),
    });
    const answer = makeAnswer({
      questionId: question.id,
    });

    await inMemoryQuestionRepository.create(question);
    await inMemoryAnswerRepository.create(answer);

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: "author-2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
