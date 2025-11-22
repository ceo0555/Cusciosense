import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Homework } from './homework.entity';
import { User } from '../../users/entities/user.entity';

export enum SubmissionStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  GRADED = 'graded',
  RETURNED = 'returned',
}

@Entity('homework_submissions')
export class HomeworkSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  homeworkId: string;

  @Column('uuid')
  studentId: string;

  @Column({ type: 'text', nullable: true })
  submissionText: string;

  @Column({ type: 'jsonb', nullable: true })
  submissionFiles: string[];

  @Column({ type: 'text', nullable: true })
  drawingData: string;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date;

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.DRAFT,
  })
  status: SubmissionStatus;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  marksObtained: number;

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @Column({ type: 'uuid', nullable: true })
  gradedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  gradedAt: Date;

  @ManyToOne(() => Homework, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'homeworkId' })
  homework: Homework;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'gradedBy' })
  grader: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
