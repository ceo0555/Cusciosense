import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import { BaseEntity } from '@/common/entities/base.entity'
import { School } from '@/modules/school/entities/school.entity'
import { User } from '@/modules/user/entities/user.entity'

@Entity('homework')
export class Homework extends BaseEntity {
  @Column({ name: 'school_id' })
  schoolId: string

  @ManyToOne(() => School)
  @JoinColumn({ name: 'school_id' })
  school: School

  @Column({ name: 'class_id' })
  classId: string

  @Column({ name: 'subject_id' })
  subjectId: string

  @Column({ name: 'teacher_id' })
  teacherId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User

  @Column()
  title: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ type: 'text', nullable: true })
  instructions?: string

  @Column({ name: 'due_date', type: 'timestamp' })
  dueDate: Date

  @Column({ name: 'max_marks', default: 100 })
  maxMarks: number

  @Column({ name: 'allow_late_submission', default: false })
  allowLateSubmission: boolean

  @Column({ name: 'submission_type', type: 'varchar', array: true })
  submissionType: string[]

  @Column({ type: 'jsonb', default: [] })
  attachments: any[]
}
