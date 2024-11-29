import { Attachment } from "@/application/entities/attachment";
import { AttachmentsRepository } from "@/application/repositories/attachments-repository";

export class InMemoryAttachmentRepository implements AttachmentsRepository {
  public items: Attachment[] = [];

  async create(attachment: Attachment): Promise<void> {
    this.items.push(attachment);
  }
}
