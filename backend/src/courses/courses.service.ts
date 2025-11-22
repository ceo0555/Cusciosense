import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(classSubjectId: string, data: any) {
    return this.prisma.course.create({ 
      data: { ...data, classSubjectId },
      include: { content: true }
    });
  }

  async findAll(classSubjectId: string) {
    return this.prisma.course.findMany({ 
      where: { classSubjectId },
      include: { content: true }
    });
  }

  async findOne(id: string) {
    return this.prisma.course.findUnique({ 
      where: { id },
      include: { content: { orderBy: { orderIndex: 'asc' } } }
    });
  }
}
