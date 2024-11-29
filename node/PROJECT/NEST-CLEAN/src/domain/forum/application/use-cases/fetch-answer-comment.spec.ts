import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { makeStudent } from "test/factories/make-student";
import { InMemoryAnswerCommentRepository } from "test/repositories/in-memory-answer-comment-repository";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comment";

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository;
let inMemoryStudentRepository: InMemoryStudentRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch Answer Comments Use Case", () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository(
      inMemoryStudentRepository,
    );
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentRepository);
  });

  it("should be able to fetch answer comments", async () => {
    const student = makeStudent({ name: "john Doe" });
    inMemoryStudentRepository.create(student);

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID("answer-1"),
      authorId: student.id,
    });
    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID("answer-1"),
      authorId: student.id,
    });
    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID("answer-1"),
      authorId: student.id,
    });

    await inMemoryAnswerCommentRepository.create(comment1);
    await inMemoryAnswerCommentRepository.create(comment2);
    await inMemoryAnswerCommentRepository.create(comment3);

    const result = await sut.execute({
      page: 1,
      answerId: "answer-1",
    });

    expect(result.value?.comments).toHaveLength(3);
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          commentId: comment1.id,
        }),
        expect.objectContaining({
          commentId: comment1.id,
        }),
        expect.objectContaining({
          commentId: comment1.id,
        }),
      ]),
    );
  });

  it("should be able to fetch paginated answer comments", async () => {
    const student = makeStudent({ name: "john Doe" });
    inMemoryStudentRepository.create(student);

    [...Array(22)].map(async (_, i) => {
      await inMemoryAnswerCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID("answer-1"),
          authorId: student.id,
        }),
      );
    });

    const result = await sut.execute({
      page: 2,
      answerId: "answer-1",
    });

    expect(result.value?.comments).toHaveLength(2);
  });
});
