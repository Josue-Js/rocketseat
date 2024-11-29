import { Question } from "../../enterprise/entities/question";
import { Student } from "../../enterprise/entities/student";

export abstract class StudentsRepository {
  abstract create(student: Student): Promise<void>;
  abstract findByEmail(email: string): Promise<Student | null>;
}
