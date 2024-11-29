import { StudentsRepository } from "@/domain/forum/application/repositories/student-repository";
import { Student } from "@/domain/forum/enterprise/entities/student";

export class InMemoryStudentRepository implements StudentsRepository {
  public items: Student[] = [];

  async create(student: Student): Promise<void> {
    this.items.push(student);
  }

  async findByEmail(email: string): Promise<Student | null> {
    return this.items.find((item) => item.email === email) ?? null;
  }
}
