import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class TimetableService {
  constructor(private prisma: PrismaService) {}

  async create(classId: string, data: any) {
    return this.prisma.timetable.create({ data: { ...data, classId } });
  }

  async findAll(classId: string) {
    return this.prisma.timetable.findMany({ 
      where: { classId },
      include: { subject: true },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
    });
  }
}
