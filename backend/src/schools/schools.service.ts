import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class SchoolsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.school.create({
      data: {
        ...data,
        code: data.code || this.generateSchoolCode(data.name),
      },
    });
  }

  async findAll(filters: any = {}) {
    return this.prisma.school.findMany({
      where: filters,
      include: {
        _count: {
          select: {
            schoolUsers: true,
            academicYears: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const school = await this.prisma.school.findUnique({
      where: { id },
      include: {
        academicYears: {
          where: { isCurrent: true },
        },
        _count: {
          select: {
            schoolUsers: true,
          },
        },
      },
    });

    if (!school) {
      throw new NotFoundException('School not found');
    }

    return school;
  }

  async update(id: string, data: any) {
    return this.prisma.school.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.school.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async addUser(schoolId: string, userId: string, role: any) {
    return this.prisma.schoolUser.create({
      data: {
        schoolId,
        userId,
        role,
      },
    });
  }

  private generateSchoolCode(name: string): string {
    const prefix = name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 3);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `${prefix}${random}`;
  }
}
