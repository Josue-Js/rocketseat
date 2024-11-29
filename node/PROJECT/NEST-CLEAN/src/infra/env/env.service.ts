import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Env } from "./env";

@Injectable()
export class EnvService {
  constructor(private configServices: ConfigService<Env, true>) {}

  get<T extends keyof Env>(key: T) {
    return this.configServices.get<T>(key);
  }
}
