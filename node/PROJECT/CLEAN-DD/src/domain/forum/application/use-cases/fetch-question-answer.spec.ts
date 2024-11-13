import { makeAnswer } from "test/factories/make-answer";
import { FetchQuestionAnswerUseCase } from "./fetch-question-answer";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let sut: FetchQuestionAnswerUseCase;

describe("Fetch Question Answers Use Case", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();

    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository
    );
    sut = new FetchQuestionAnswerUseCase(inMemoryAnswerRepository);
  });

  it("should be able to fetch question answers", async () => {
    await inMemoryAnswerRepository.create(
      makeAnswer({ questionId: new UniqueEntityID("question-1") })
    );
    await inMemoryAnswerRepository.create(
      makeAnswer({ questionId: new UniqueEntityID("question-1") })
    );
    await inMemoryAnswerRepository.create(
      makeAnswer({ questionId: new UniqueEntityID("question-1") })
    );

    const result = await sut.execute({
      page: 1,
      questionId: "question-1",
    });

    expect(result.value?.answers).toHaveLength(3);
  });

  it("should be able to fetch paginated question answers", async () => {
    [...Array(22)].map(async (_, i) => {
      await inMemoryAnswerRepository.create(
        makeAnswer({ questionId: new UniqueEntityID("question-1") })
      );
    });

    const result = await sut.execute({
      page: 2,
      questionId: "question-1",
    });

    expect(result.value?.answers).toHaveLength(2);
  });
});
