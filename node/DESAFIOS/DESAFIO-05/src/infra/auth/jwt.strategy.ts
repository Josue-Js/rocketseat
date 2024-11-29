import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { z } from "zod";
import { EnvService } from "../env/env.service";
import { CourierRepository } from "@/application/repositories/courier-repository";
import { Role } from "@prisma/client";

const userPayloadSchema = z.object({
  sub: z.string().uuid(),
});

export type UserPayload = z.infer<typeof userPayloadSchema>;

export type User = {
  id: string;
  role: Role;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: EnvService,
    private courierRepository: CourierRepository,
  ) {
    const secret = config.get("JWT_SECRET");

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      algorithms: ["HS256"],
    });
  }

  async validate(payload: UserPayload) {
    const user_payload = userPayloadSchema.parse(payload);

    const user = await this.courierRepository.findById(user_payload.sub);

    if (!user) throw new BadRequestException();

    return {
      id: user.id.toString(),
      role: user.role,
    };
  }
}
