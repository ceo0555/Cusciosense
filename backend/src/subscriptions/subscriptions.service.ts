import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(schoolId: string, data: any) {
    return this.prisma.subscription.create({ data: { ...data, schoolId } });
  }

  async findAll(schoolId: string) {
    return this.prisma.subscription.findMany({ where: { schoolId } });
  }
}
