import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryQuestionCommentRepository } from "test/repositories/in-memory-question-comment-repository";
import { FetchQuestionCommentUseCase } from "./fetch-question-comments";

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let sut: FetchQuestionCommentUseCase;

describe("Fetch Question Comments Use Case", () => {
  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository();
    sut = new FetchQuestionCommentUseCase(inMemoryQuestionCommentRepository);
  });

  it("should be able to fetch question question comments", async () => {
    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID("question-1") })
    );
    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID("question-1") })
    );
    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID("question-1") })
    );

    const result = await sut.execute({
      page: 1,
      questionId: "question-1",
    });

    expect(result.value?.questionComments).toHaveLength(3);
  });

  it("should be able to fetch paginated question comments", async () => {
    [...Array(22)].map(async (_, i) => {
      await inMemoryQuestionCommentRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityID("question-1") })
      );
    });

    const result = await sut.execute({
      page: 2,
      questionId: "question-1",
    });

    expect(result.value?.questionComments).toHaveLength(2);
  });
});
