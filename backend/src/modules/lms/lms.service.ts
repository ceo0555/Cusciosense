import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LmsService {
  constructor(private prisma: PrismaService) {}

  // Courses
  async createCourse(data: any, createdById: string) {
    return this.prisma.course.create({
      data: { ...data, createdById },
    });
  }

  async getCourses(filters: any) {
    const { subjectId, isPublished } = filters;
    return this.prisma.course.findMany({
      where: {
        ...(subjectId && { subjectId }),
        ...(isPublished !== undefined && { isPublished }),
      },
      include: { subject: true, content: true },
      orderBy: { sequenceOrder: 'asc' },
    });
  }

  async getCourse(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      include: { subject: true, content: true },
    });
  }

  async updateCourse(id: string, data: any) {
    return this.prisma.course.update({
      where: { id },
      data,
    });
  }

  // Course Content
  async addContent(courseId: string, data: any) {
    return this.prisma.courseContent.create({
      data: { ...data, courseId },
    });
  }

  async getContent(courseId: string) {
    return this.prisma.courseContent.findMany({
      where: { courseId },
      orderBy: { sequenceOrder: 'asc' },
    });
  }

  async updateContent(id: string, data: any) {
    return this.prisma.courseContent.update({
      where: { id },
      data,
    });
  }

  async deleteContent(id: string) {
    return this.prisma.courseContent.delete({
      where: { id },
    });
  }
}
