import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async create(schoolId: string, data: any) {
    return this.prisma.subject.create({ data: { ...data, schoolId } });
  }

  async findAll(schoolId: string) {
    return this.prisma.subject.findMany({ where: { schoolId } });
  }

  async findOne(id: string) {
    return this.prisma.subject.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.subject.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.subject.delete({ where: { id } });
  }
}
