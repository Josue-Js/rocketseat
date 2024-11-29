import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { makeStudent } from "test/factories/make-student";
import { InMemoryQuestionCommentRepository } from "test/repositories/in-memory-question-comment-repository";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { FetchQuestionCommentUseCase } from "./fetch-question-comments";

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let inMemoryStudentRepository: InMemoryStudentRepository;
let sut: FetchQuestionCommentUseCase;

describe("Fetch Question Comments Use Case", () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository(
      inMemoryStudentRepository,
    );
    sut = new FetchQuestionCommentUseCase(inMemoryQuestionCommentRepository);
  });

  it("should be able to fetch question question comments", async () => {
    const student = makeStudent({ name: "John Doe" });
    inMemoryStudentRepository.create(student);

    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityID("question-1"),
      authorId: student.id,
    });
    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityID("question-1"),
      authorId: student.id,
    });
    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityID("question-1"),
      authorId: student.id,
    });

    await inMemoryQuestionCommentRepository.create(comment1);
    await inMemoryQuestionCommentRepository.create(comment2);
    await inMemoryQuestionCommentRepository.create(comment3);

    const result = await sut.execute({
      page: 1,
      questionId: "question-1",
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

  it("should be able to fetch paginated question comments", async () => {
    const student = makeStudent({ name: "John Doe" });
    inMemoryStudentRepository.create(student);

    [...Array(22)].map(async (_, i) => {
      await inMemoryQuestionCommentRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID("question-1"),
          authorId: student.id,
        }),
      );
    });

    const result = await sut.execute({
      page: 2,
      questionId: "question-1",
    });

    expect(result.value?.comments).toHaveLength(2);
  });
});
