import { InMemoryAttachmentRepository } from "test/repositories/in-memory-attachment-repository";
import { FakeUploader } from "test/storage/fake-uploader";
import { UploadAndCreateAttachmentUseCase } from "./upload-and-create-attachment";
import { BadRequestException } from "@nestjs/common";

let inMemoryAttachmentRepository: InMemoryAttachmentRepository;
let fakeUploader: FakeUploader;
let sut: UploadAndCreateAttachmentUseCase;

describe("Upload and create attachments", () => {
  beforeEach(() => {
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository();
    fakeUploader = new FakeUploader();
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentRepository,
      fakeUploader,
    );
  });

  it("should be able to upload and create attachment ", async () => {
    const result = await sut.execute({
      fileName: "profile.png",
      fileType: "image/png",
      body: Buffer.from(""),
    });

    expect(result).toMatchObject({
      title: "profile.png",
    });
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: "profile.png",
      }),
    );
  });

  it("should not be able to upload an attachment invalid file type", async () => {
    await expect(
      async () =>
        await sut.execute({
          fileName: "profile.png",
          fileType: "audio/mpeg",
          body: Buffer.from(""),
        }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
