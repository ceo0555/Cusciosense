import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ClassesService } from "./classes.service";
import { Roles, RolesGuard } from "@/common/guards/roles.guard";
import { AuthGuard } from "@nestjs/passport";

class CreateClassDto {
  schoolId: string;
  title: string;
  grade: string;
}

@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("classes")
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @Roles("SUPER_ADMIN", "SCHOOL_ADMIN")
  create(@Body() dto: CreateClassDto) {
    return this.classesService.create(dto);
  }

  @Get("school/:schoolId")
  @Roles("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER")
  list(@Param("schoolId") schoolId: string) {
    return this.classesService.listBySchool(schoolId);
  }
}
