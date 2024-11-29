import { Prisma, User as PrismaUser } from "@prisma/client";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/valueObject/slug";
import { Student } from "@/domain/forum/enterprise/entities/student";

export class PrismaStudentMapper {
  static toDomain(raw: PrismaUser): Student {
    return Student.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password_hash,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      password_hash: student.password,
    };
  }
}
