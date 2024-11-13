import { makeAnswer } from "test/factories/make-answer";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionCommentRepository } from "test/repositories/in-memory-question-comment-repository";
import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { CommentOnQuestionUseCase } from "./comment-on-question";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let sut: CommentOnQuestionUseCase;

describe("Comment On Question Use Case", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository
    );
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository();
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryQuestionCommentRepository
    );
  });

  it("should be able to comment on question", async () => {
    const question = makeQuestion();

    await inMemoryQuestionRepository.create(question);

    const result = await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: "Comment test",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionCommentRepository.items[0].content).toEqual(
      "Comment test"
    );
  });
});
