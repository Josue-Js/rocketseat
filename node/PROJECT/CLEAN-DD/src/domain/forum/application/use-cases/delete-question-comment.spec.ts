import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryQuestionCommentRepository } from "test/repositories/in-memory-question-comment-repository";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let sut: DeleteQuestionCommentUseCase;

describe("Delete Question Comment Use Case", () => {
  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository();
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentRepository);
  });

  it("should be able to comment on question", async () => {
    const questionComment = makeQuestionComment();

    await inMemoryQuestionCommentRepository.create(questionComment);

    await sut.execute({
      authorId: questionComment.authorId.toString(),
      questionCommentId: questionComment.id.toString(),
    });

    expect(inMemoryQuestionCommentRepository.items).toHaveLength(0);
  });

  it("should not be able to delete another user question comment", async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityID("author-1"),
    });

    await inMemoryQuestionCommentRepository.create(questionComment);

    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: "author-2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
