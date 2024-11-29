import { makeQuestion } from "test/factories/make-question";
import { InMemoryAttachmentRepository } from "test/repositories/in-memory-attachment-repository";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { Slug } from "../../enterprise/entities/valueObject/slug";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-question";

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryAttachmentRepository: InMemoryAttachmentRepository;
let inMemoryStudentRepository: InMemoryStudentRepository;
let sut: FetchRecentQuestionsUseCase;

describe("Fetch recent topics Use Case", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository();
    inMemoryStudentRepository = new InMemoryStudentRepository();

    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryAttachmentRepository,
      inMemoryStudentRepository,
    );
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionRepository);
  });

  it("should be able to fetch recent question", async () => {
    await inMemoryQuestionRepository.create(
      makeQuestion({
        slug: Slug.create("example-question"),
        createdAt: new Date(2022, 0, 20),
      }),
    );
    await inMemoryQuestionRepository.create(
      makeQuestion({
        slug: Slug.create("example-question"),
        createdAt: new Date(2022, 0, 18),
      }),
    );
    await inMemoryQuestionRepository.create(
      makeQuestion({
        slug: Slug.create("example-question"),
        createdAt: new Date(2022, 0, 23),
      }),
    );

    const result = await sut.execute({
      page: 1,
    });

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ]);
  });

  it("should be able to fetch paginated recent question", async () => {
    [...Array(22)].map(async (_, i) => {
      await inMemoryQuestionRepository.create(makeQuestion({}));
    });

    const result = await sut.execute({
      page: 2,
    });

    expect(result.value?.questions).toHaveLength(2);
  });
});
