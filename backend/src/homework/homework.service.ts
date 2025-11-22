import { Injectable } from "@nestjs/common";
import { DatabaseService } from "@/database/database.service";

@Injectable()
export class HomeworkService {
  constructor(private readonly db: DatabaseService) {}

  assign(data: {
    courseId: string;
    assignedBy: string;
    dueAt: Date;
    instructions: string;
  }) {
    return this.db.homework.create({
      data,
    });
  }

  listByCourse(courseId: string) {
    return this.db.homework.findMany({
      where: { courseId },
      include: {
        submissions: {
          take: 5,
          orderBy: { submittedAt: "desc" },
        },
      },
    });
  }

  submit(data: {
    homeworkId: string;
    studentId: string;
    text?: string;
    drawingUrl?: string;
    files?: Record<string, unknown>;
  }) {
    return this.db.homeworkSubmission.upsert({
      where: {
        homeworkId_studentId: {
          homeworkId: data.homeworkId,
          studentId: data.studentId,
        },
      },
      create: {
        ...data,
      },
      update: {
        text: data.text,
        drawingUrl: data.drawingUrl,
        files: data.files,
        submittedAt: new Date(),
      },
    });
  }
}
