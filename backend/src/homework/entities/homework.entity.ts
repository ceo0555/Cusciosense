import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { User } from '../../users/entities/user.entity';

@Entity('homework')
export class Homework {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  courseId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  totalMarks: number;

  @Column({ default: false })
  allowLateSubmission: boolean;

  @Column({ type: 'jsonb', nullable: true })
  submissionTypes: string[];

  @Column({ type: 'jsonb', nullable: true })
  attachments: string[];

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ default: false })
  isPublished: boolean;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
