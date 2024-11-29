import {
  UploadParams,
  Uploader,
} from "@/domain/forum/application/storage/uploader";
import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "node:crypto";
import { EnvService } from "../env/env.service";

@Injectable()
export class CloudinaryStorage implements Uploader {
  constructor(private envService: EnvService) {
    cloudinary.config({
      cloud_name: envService.get("CLOUDINARY_CLOUD_NAME"),
      api_key: envService.get("CLOUDINARY_API_KEY"),
      api_secret: envService.get("CLOUDINARY_API_SECRET_KEY"),
    });
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID();
    const uniqueFileName = `${fileName}-${uploadId}`;

    console.log("CALL CLOUD");
    const uploadStream = await cloudinary.uploader.upload_stream(
      { folder: "teste" },
      (error, result) => {
        console.log("ERROR: ", error);
        console.log("Result: ", result);
      },
    );

    uploadStream.end(body);

    return { url: uniqueFileName };
  }
}
