import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('quizzes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @Roles('TEACHER', 'SCHOOL_ADMIN')
  createQuiz(@Body() data: any, @CurrentUser() user: any) {
    return this.quizService.createQuiz(data, user.id);
  }

  @Get()
  getQuizzes(@Query() query: any) {
    return this.quizService.getQuizzes(query);
  }

  @Get(':id')
  getQuiz(@Param('id') id: string) {
    return this.quizService.getQuiz(id);
  }

  @Post(':id/start')
  @Roles('STUDENT')
  startQuiz(@Param('id') quizId: string, @Body('studentId') studentId: string) {
    return this.quizService.startQuiz(quizId, studentId);
  }

  @Post(':id/submit')
  @Roles('STUDENT')
  submitQuiz(@Param('id') quizId: string, @Body() data: any) {
    return this.quizService.submitQuiz(quizId, data);
  }
}
