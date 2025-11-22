import { Injectable } from "@nestjs/common";
import { DatabaseService } from "@/database/database.service";
import { PaginationDto } from "@/common/dto/pagination.dto";

@Injectable()
export class SchoolsService {
  constructor(private readonly db: DatabaseService) {}

  create(data: { name: string; adminId: string }) {
    return this.db.school.create({
      data,
    });
  }

  findOne(id: string) {
    return this.db.school.findUnique({
      where: { id },
      include: {
        admin: true,
        classrooms: { take: 3 },
      },
    });
  }

  findAll(pagination: PaginationDto) {
    const { page, limit } = pagination;
    return this.db.school.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }
}
