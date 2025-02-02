import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { Env } from "@/infra/env/env";
import { JwtStrategy } from "./jwt.strategy";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { EnvService } from "../env/env.service";
import { EnvModule } from "../env/env.module";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        const publicKey = env.get("JWT_PUBLIC_KEY");
        const privateKey = env.get("JWT_PRIVATE_KEY");

        return {
          signOptions: { algorithm: "RS256" },
          publicKey: Buffer.from(publicKey, "base64"),
          privateKey: Buffer.from(privateKey, "base64"),
        };
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategy,
    EnvService,
  ],
})
export class AuthModule {}
