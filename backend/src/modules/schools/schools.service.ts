import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';

@Injectable()
export class SchoolsService {
  constructor(private prisma: PrismaService) {}

  async create(createSchoolDto: CreateSchoolDto, userId: string) {
    return this.prisma.school.create({
      data: {
        ...createSchoolDto,
        createdById: userId,
      },
    });
  }

  async findAll(filters?: any) {
    const { page = 1, limit = 20, search } = filters || {};
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [schools, total] = await Promise.all([
      this.prisma.school.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: {
            select: {
              students: true,
              staff: true,
              classes: true,
            },
          },
        },
      }),
      this.prisma.school.count({ where }),
    ]);

    return {
      data: schools,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const school = await this.prisma.school.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            students: true,
            staff: true,
            classes: true,
            academicYears: true,
          },
        },
      },
    });

    if (!school) {
      throw new NotFoundException('School not found');
    }

    return school;
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto) {
    return this.prisma.school.update({
      where: { id },
      data: updateSchoolDto,
    });
  }

  async remove(id: string) {
    return this.prisma.school.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async addAdmin(schoolId: string, userId: string) {
    return this.prisma.schoolAdmin.create({
      data: {
        schoolId,
        userId,
      },
    });
  }
}
