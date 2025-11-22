import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { School } from './entities/school.entity'
import { CreateSchoolDto } from './dto/create-school.dto'
import { UpdateSchoolDto } from './dto/update-school.dto'

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(School)
    private schoolRepository: Repository<School>,
  ) {}

  async create(createSchoolDto: CreateSchoolDto) {
    const school = this.schoolRepository.create(createSchoolDto)
    return this.schoolRepository.save(school)
  }

  async findAll(query: any) {
    const { page = 1, limit = 20, search } = query

    const queryBuilder = this.schoolRepository.createQueryBuilder('school')

    if (search) {
      queryBuilder.where(
        '(school.name ILIKE :search OR school.email ILIKE :search)',
        { search: `%${search}%` },
      )
    }

    const [data, total] = await queryBuilder
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
    const school = await this.schoolRepository.findOne({ where: { id } })

    if (!school) {
      throw new NotFoundException('School not found')
    }

    return school
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto) {
    const school = await this.findOne(id)
    Object.assign(school, updateSchoolDto)
    return this.schoolRepository.save(school)
  }

  async remove(id: string) {
    const school = await this.findOne(id)
    await this.schoolRepository.softRemove(school)
    return { message: 'School deleted successfully' }
  }
}
