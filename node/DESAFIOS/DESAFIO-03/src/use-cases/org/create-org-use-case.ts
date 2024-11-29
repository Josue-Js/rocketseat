import bcrypt from "bcryptjs";
import { OrgRepository } from "@/repositories/org-repository";

interface CreateOrgRequest {
  email: string;
  name_of_person_responsible: string;
  city: string;
  state: string;
  zip_code: string;
  street: string;
  phone: string;
  password: string;
}

export class CreateOrgUseCase {
  constructor(private orgRepository: OrgRepository) {}

  async execute({
    city,
    email,
    name_of_person_responsible,
    password,
    phone,
    state,
    street,
    zip_code,
  }: CreateOrgRequest) {
    const orgAlreadyExist = await this.orgRepository.findByEmail(email);

    if (orgAlreadyExist) throw new Error("Org already exist");

    const password_hash = await bcrypt.hash(password, 7);

    const org = await this.orgRepository.create({
      email,
      city,
      name_of_person_responsible,
      phone,
      state,
      street,
      password_hash,
      zip_code,
    });

    return { org };
  }
}
