import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ClassEntity } from '../../classes/entities/class.entity';
import { User } from '../../users/entities/user.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  classId: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 50, nullable: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: true })
  teacherId: string;

  @Column({ nullable: true })
  syllabusUrl: string;

  @Column({ nullable: true })
  credits: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => ClassEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classId' })
  class: ClassEntity;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'teacherId' })
  teacher: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
