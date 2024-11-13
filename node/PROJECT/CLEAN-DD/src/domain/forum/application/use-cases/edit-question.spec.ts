import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { Slug } from "../../enterprise/entities/valueObject/slug";
import { EditQuestionUseCase } from "./edit-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: EditQuestionUseCase;

describe("Edit Question Use Case", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();

    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository
    );

    sut = new EditQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryQuestionAttachmentRepository
    );
  });

  it("should be able to update a question", async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create("example-question"),
      authorId: new UniqueEntityID("author-1"),
    });

    inMemoryQuestionRepository.create(newQuestion);

    inMemoryQuestionAttachmentRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID("1"),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID("2"),
      })
    );

    await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: "author-1",
      title: "title test",
      content: "content test",
      attachmentsId: ["1", "3"],
    });

    expect(inMemoryQuestionRepository.items[0]).toMatchObject({
      title: "title test",
      content: "content test",
    });
    expect(
      inMemoryQuestionRepository.items[0].attachments.currentItems
    ).toHaveLength(2);
    expect(
      inMemoryQuestionRepository.items[0].attachments.currentItems
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityID("3") }),
    ]);
  });

  it("should not be able to update a question from another user", async () => {
    const newQuestion = makeQuestion(
      {
        slug: Slug.create("example-question"),
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("question-1")
    );
    inMemoryQuestionRepository.create(newQuestion);

    const result = await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: "author-2",
      title: "title test",
      content: "content test",
      attachmentsId: [],
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
