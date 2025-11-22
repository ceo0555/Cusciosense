import { Injectable } from "@nestjs/common";
import { DatabaseService } from "@/database/database.service";

@Injectable()
export class ClassesService {
  constructor(private readonly db: DatabaseService) {}

  create(data: { schoolId: string; title: string; grade: string }) {
    return this.db.classroom.create({
      data,
    });
  }

  listBySchool(schoolId: string) {
    return this.db.classroom.findMany({
      where: { schoolId },
      include: { homeroomTeacher: true },
    });
  }
}
