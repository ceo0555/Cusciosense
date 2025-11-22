import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async create(classSubjectId: string, teacherId: string, data: any) {
    return this.prisma.quiz.create({ data: { ...data, classSubjectId, teacherId } });
  }

  async findAll(classSubjectId: string) {
    return this.prisma.quiz.findMany({ where: { classSubjectId } });
  }

  async findOne(id: string) {
    return this.prisma.quiz.findUnique({ 
      where: { id },
      include: { questions: true }
    });
  }
}
