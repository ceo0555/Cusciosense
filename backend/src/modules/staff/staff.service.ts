import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.staff.create({
      data,
      include: { user: true, school: true },
    });
  }

  async findAll(filters: any) {
    const { schoolId, staffType, page = 1, limit = 20 } = filters;
    
    const where: any = { schoolId };
    if (staffType) where.staffType = staffType;

    const [staff, total] = await Promise.all([
      this.prisma.staff.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { user: true },
      }),
      this.prisma.staff.count({ where }),
    ]);

    return { data: staff, total, page, limit };
  }

  async findOne(id: string) {
    return this.prisma.staff.findUnique({
      where: { id },
      include: { user: true, school: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.staff.update({
      where: { id },
      data,
    });
  }
}
