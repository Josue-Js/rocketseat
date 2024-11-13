import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { Slug } from "../../enterprise/entities/valueObject/slug";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: GetQuestionBySlugUseCase;

describe("Get Question by slug Use Case", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository
    );
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository);
  });

  it("should be able to get a question by slug", async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create("example-question"),
    });
    inMemoryQuestionRepository.create(newQuestion);

    const result = await sut.execute({
      slug: "example-question",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBeTruthy();
    // expect(result.value.question.title).toEqual(newQuestion.title);
  });
});
