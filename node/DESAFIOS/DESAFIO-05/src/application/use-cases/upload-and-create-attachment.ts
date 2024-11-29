import { BadRequestException, Injectable } from "@nestjs/common";

import { Uploader } from "../storage/uploader";
import { Attachment } from "../entities/attachment";
import { AttachmentsRepository } from "../repositories/attachments-repository";

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
}

type UploadAndCreateAttachmentUseCaseResponse = Attachment;

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    const validMimeType = /^(image)\/(jpeg|png|jpg)$|^application\/pdf$/;

    if (!validMimeType.test(fileType)) throw new BadRequestException();

    const { url } = await this.uploader.upload({ fileName, fileType, body });

    const attachment = Attachment.create({
      title: fileName,
      url,
    });

    this.attachmentsRepository.create(attachment);

    return attachment;
  }
}
