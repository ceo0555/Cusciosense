import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { HomeworkService } from "./homework.service";
import { AuthGuard } from "@nestjs/passport";
import { Roles, RolesGuard } from "@/common/guards/roles.guard";
import { CurrentUser } from "@/common/decorators/current-user.decorator";

class AssignHomeworkDto {
  courseId: string;
  dueAt: Date;
  instructions: string;
}

class SubmitHomeworkDto {
  text?: string;
  drawingUrl?: string;
  files?: Record<string, unknown>;
}

@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("homework")
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @Post()
  @Roles("TEACHER")
  assign(@Body() dto: AssignHomeworkDto, @CurrentUser() user: any) {
    return this.homeworkService.assign({
      courseId: dto.courseId,
      instructions: dto.instructions,
      dueAt: dto.dueAt,
      assignedBy: user.userId,
    });
  }

  @Get("course/:courseId")
  @Roles("TEACHER", "STUDENT", "PARENT")
  list(@Param("courseId") courseId: string) {
    return this.homeworkService.listByCourse(courseId);
  }

  @Post(":id/submit")
  @Roles("STUDENT")
  submit(
    @Param("id") homeworkId: string,
    @CurrentUser() user: any,
    @Body() dto: SubmitHomeworkDto
  ) {
    return this.homeworkService.submit({
      homeworkId,
      studentId: user.userId,
      ...dto,
    });
  }
}
