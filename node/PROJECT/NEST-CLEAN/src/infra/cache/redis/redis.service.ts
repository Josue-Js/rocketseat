import { EnvService } from "@/infra/env/env.service";
import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { Redis } from "ioredis";

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(envService: EnvService) {
    const db = Number(envService.get("REDIS_DB"));
    const port = Number(envService.get("REDIS_PORT"));

    super({
      host: envService.get("REDIS_HOST"),
      db: db,
      port: port,
    });
  }
  onModuleDestroy() {
    return this.disconnect();
  }
}
