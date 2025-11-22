import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  async createQuiz(data: any, createdById: string) {
    return this.prisma.quiz.create({
      data: { ...data, createdById },
    });
  }

  async getQuizzes(filters: any) {
    const { sectionId, subjectId, isPublished } = filters;
    
    return this.prisma.quiz.findMany({
      where: {
        ...(sectionId && { sectionId }),
        ...(subjectId && { subjectId }),
        ...(isPublished !== undefined && { isPublished }),
      },
      include: { subject: true, section: true },
      orderBy: { startTime: 'desc' },
    });
  }

  async getQuiz(id: string) {
    return this.prisma.quiz.findUnique({
      where: { id },
      include: { subject: true, section: true },
    });
  }

  async startQuiz(quizId: string, studentId: string) {
    const quiz = await this.getQuiz(quizId);
    
    return this.prisma.quizAttempt.create({
      data: {
        quizId,
        studentId,
        startedAt: new Date(),
        answers: {},
        marksObtained: 0,
        submittedAt: new Date(), // Will be updated on actual submission
        timeTakenMinutes: 0,
        status: 'IN_PROGRESS',
      },
    });
  }

  async submitQuiz(quizId: string, data: any) {
    const { attemptId, answers } = data;
    const quiz = await this.getQuiz(quizId);
    
    // Calculate marks
    const questions = quiz.questions as any[];
    let marksObtained = 0;
    
    questions.forEach((q: any, index: number) => {
      const userAnswer = answers.find((a: any) => a.questionId === index);
      if (userAnswer && userAnswer.answer === q.correctAnswer) {
        marksObtained += q.marks || 1;
      }
    });

    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
    });

    const timeTaken = Math.floor(
      (new Date().getTime() - new Date(attempt.startedAt).getTime()) / 60000,
    );

    return this.prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        answers,
        marksObtained,
        submittedAt: new Date(),
        timeTakenMinutes: timeTaken,
        status: 'EVALUATED',
      },
    });
  }
}
