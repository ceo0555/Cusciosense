import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Homework } from './entities/homework.entity';
import { HomeworkSubmission } from './entities/homework-submission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Homework, HomeworkSubmission])],
  controllers: [],
  providers: [],
  exports: [],
})
export class HomeworkModule {}
