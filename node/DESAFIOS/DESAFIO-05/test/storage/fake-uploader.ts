import { Uploader, UploadParams } from "@/application/storage/uploader";
import { faker } from "@faker-js/faker";

interface Upload {
  fileName: string;
  url: string;
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = [];

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = faker.internet.url();
    this.uploads.push({ fileName, url });

    return { url };
  }
}
