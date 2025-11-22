import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async create(schoolId: string, data: any) {
    return this.prisma.exam.create({ data: { ...data, schoolId } });
  }

  async findAll(schoolId: string) {
    return this.prisma.exam.findMany({ where: { schoolId } });
  }

  async findOne(id: string) {
    return this.prisma.exam.findUnique({ 
      where: { id },
      include: { examSubjects: { include: { classSubject: { include: { subject: true } } } } }
    });
  }
}
