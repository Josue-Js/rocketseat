import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";
import { InMemoryAnswerCommentRepository } from "test/repositories/in-memory-answer-comment-repository";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { CommentOnAnswerUseCase } from "./comment-on-answer";

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository;
let inMemoryStudentRepository: InMemoryStudentRepository;
let sut: CommentOnAnswerUseCase;

describe("Comment On Answer Use Case", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    );
    inMemoryStudentRepository = new InMemoryStudentRepository();

    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository(
      inMemoryStudentRepository,
    );
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswerCommentRepository,
    );
  });

  it("should be able to comment on answer", async () => {
    const answer = makeAnswer();

    await inMemoryAnswerRepository.create(answer);

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: "Comment test",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswerCommentRepository.items[0].content).toEqual(
      "Comment test",
    );
  });
});
