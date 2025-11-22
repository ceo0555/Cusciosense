import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { School } from '../../schools/entities/school.entity';
import { User } from '../../users/entities/user.entity';

@Entity('classes')
export class ClassEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  schoolId: string;

  @Column({ length: 100 })
  name: string;

  @Column()
  gradeLevel: number;

  @Column({ length: 10, nullable: true })
  section: string;

  @Column({ length: 20 })
  academicYear: string;

  @Column({ type: 'uuid', nullable: true })
  classTeacherId: string;

  @Column({ length: 50, nullable: true })
  roomNumber: string;

  @Column({ nullable: true })
  capacity: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => School, (school) => school.classes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'schoolId' })
  school: School;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'classTeacherId' })
  classTeacher: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
