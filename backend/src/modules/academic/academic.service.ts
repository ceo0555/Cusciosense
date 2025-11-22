import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AcademicService {
  constructor(private prisma: PrismaService) {}

  // Academic Years
  async createAcademicYear(data: any) {
    return this.prisma.academicYear.create({ data });
  }

  async getAcademicYears(schoolId: string) {
    return this.prisma.academicYear.findMany({
      where: { schoolId },
      orderBy: { startDate: 'desc' },
    });
  }

  // Classes
  async createClass(data: any) {
    return this.prisma.class.create({ data });
  }

  async getClasses(schoolId: string, academicYearId?: string) {
    return this.prisma.class.findMany({
      where: { 
        schoolId,
        ...(academicYearId && { academicYearId }),
      },
      include: { sections: true },
    });
  }

  // Sections
  async createSection(data: any) {
    return this.prisma.section.create({ data });
  }

  async getSections(classId: string) {
    return this.prisma.section.findMany({
      where: { classId },
      include: { teacher: { include: { user: true } } },
    });
  }

  // Subjects
  async createSubject(data: any) {
    return this.prisma.subject.create({ data });
  }

  async getSubjects(filters: any) {
    return this.prisma.subject.findMany({
      where: filters,
      include: { teacher: { include: { user: true } } },
    });
  }

  // Timetable
  async createTimetable(data: any) {
    return this.prisma.timetable.create({ data });
  }

  async getTimetable(sectionId: string, dayOfWeek?: string) {
    return this.prisma.timetable.findMany({
      where: {
        sectionId,
        ...(dayOfWeek && { dayOfWeek }),
      },
      include: { subject: true },
      orderBy: { startTime: 'asc' },
    });
  }
}
