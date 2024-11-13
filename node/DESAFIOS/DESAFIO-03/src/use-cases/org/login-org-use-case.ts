import bcrypt from "bcryptjs";
import { OrgRepository } from "@/repositories/org-repository";
import { Org } from "@prisma/client";

interface LoginOrgRequest {
  email: string;
  password: string;
}
interface LoginOrgResponse {
  org: Org;
}

export class LoginOrgUseCase {
  constructor(private orgRepository: OrgRepository) {}

  async execute({
    email,
    password,
  }: LoginOrgRequest): Promise<LoginOrgResponse> {
    const org = await this.orgRepository.findByEmail(email);

    if (!org) {
      throw Error("credentials invalid");
    }
    const passwordIsValid = await bcrypt.compare(password, org.password_hash);

    if (!passwordIsValid) {
      throw Error("credentials invalid");
    }

    return { org };
  }
}
