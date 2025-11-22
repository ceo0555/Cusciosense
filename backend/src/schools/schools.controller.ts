import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { SchoolsService } from "./schools.service";
import { PaginationDto } from "@/common/dto/pagination.dto";
import { AuthGuard } from "@nestjs/passport";
import { Roles, RolesGuard } from "@/common/guards/roles.guard";

class CreateSchoolDto {
  name: string;
  adminId: string;
}

@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("schools")
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get()
  @Roles("SUPER_ADMIN")
  list(@Query() pagination: PaginationDto) {
    return this.schoolsService.findAll(pagination);
  }

  @Get(":id")
  @Roles("SUPER_ADMIN", "SCHOOL_ADMIN")
  getOne(@Param("id") id: string) {
    return this.schoolsService.findOne(id);
  }

  @Post()
  @Roles("SUPER_ADMIN")
  create(@Body() dto: CreateSchoolDto) {
    return this.schoolsService.create(dto);
  }
}
