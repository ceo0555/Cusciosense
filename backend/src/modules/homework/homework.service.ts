import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Homework } from './entities/homework.entity'

@Injectable()
export class HomeworkService {
  constructor(
    @InjectRepository(Homework)
    private homeworkRepository: Repository<Homework>,
  ) {}

  async create(createData: any) {
    const homework = this.homeworkRepository.create(createData)
    return this.homeworkRepository.save(homework)
  }

  async findAll(query: any) {
    const { page = 1, limit = 20, classId, subjectId, teacherId } = query

    const queryBuilder = this.homeworkRepository
      .createQueryBuilder('homework')
      .leftJoinAndSelect('homework.teacher', 'teacher')

    if (classId) {
      queryBuilder.andWhere('homework.classId = :classId', { classId })
    }

    if (subjectId) {
      queryBuilder.andWhere('homework.subjectId = :subjectId', { subjectId })
    }

    if (teacherId) {
      queryBuilder.andWhere('homework.teacherId = :teacherId', { teacherId })
    }

    const [data, total] = await queryBuilder
      .orderBy('homework.dueDate', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    return {
      data,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: string) {
    const homework = await this.homeworkRepository.findOne({
      where: { id },
      relations: ['teacher', 'school'],
    })

    if (!homework) {
      throw new NotFoundException('Homework not found')
    }

    return homework
  }

  async update(id: string, updateData: any) {
    const homework = await this.findOne(id)
    Object.assign(homework, updateData)
    return this.homeworkRepository.save(homework)
  }

  async remove(id: string) {
    const homework = await this.findOne(id)
    await this.homeworkRepository.softRemove(homework)
    return { message: 'Homework deleted successfully' }
  }
}
