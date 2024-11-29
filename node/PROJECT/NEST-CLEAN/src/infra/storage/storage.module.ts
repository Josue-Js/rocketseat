import { Uploader } from "@/domain/forum/application/storage/uploader";
import { Module } from "@nestjs/common";
import { EnvModule } from "../env/env.module";
import { CloudinaryStorage } from "./cloudinary-storage";

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: CloudinaryStorage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
