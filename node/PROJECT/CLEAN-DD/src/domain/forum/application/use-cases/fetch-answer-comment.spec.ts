import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { InMemoryAnswerCommentRepository } from "test/repositories/in-memory-answer-comment-repository";
import { FetchAnswerCommentUseCase } from "./fetch-answer-comment";

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository;
let sut: FetchAnswerCommentUseCase;

describe("Fetch Answer Comments Use Case", () => {
  beforeEach(() => {
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository();
    sut = new FetchAnswerCommentUseCase(inMemoryAnswerCommentRepository);
  });

  it("should be able to fetch answer comments", async () => {
    await inMemoryAnswerCommentRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID("answer-1") })
    );
    await inMemoryAnswerCommentRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID("answer-1") })
    );
    await inMemoryAnswerCommentRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID("answer-1") })
    );

    const result = await sut.execute({
      page: 1,
      answerId: "answer-1",
    });

    expect(result.value?.answerComments).toHaveLength(3);
  });

  it("should be able to fetch paginated answer comments", async () => {
    [...Array(22)].map(async (_, i) => {
      await inMemoryAnswerCommentRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityID("answer-1") })
      );
    });

    const result = await sut.execute({
      page: 2,
      answerId: "answer-1",
    });

    expect(result.value?.answerComments).toHaveLength(2);
  });
});
