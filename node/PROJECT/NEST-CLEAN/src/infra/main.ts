import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { EnvService } from "./env/env.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const envServices = app.get(EnvService);
  const port = envServices.get("PORT");

  await app.listen(port);
}
bootstrap();
