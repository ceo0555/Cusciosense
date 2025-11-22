import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from './entities/school.entity';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School)
    private schoolsRepository: Repository<School>,
  ) {}

  async create(createSchoolDto: CreateSchoolDto): Promise<School> {
    const school = this.schoolsRepository.create(createSchoolDto);
    return this.schoolsRepository.save(school);
  }

  async findAll(): Promise<School[]> {
    return this.schoolsRepository.find();
  }

  async findById(id: string): Promise<School> {
    const school = await this.schoolsRepository.findOne({
      where: { id },
      relations: ['classes'],
    });

    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }

    return school;
  }

  async findByCode(code: string): Promise<School | null> {
    return this.schoolsRepository.findOne({ where: { code } });
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto): Promise<School> {
    const school = await this.findById(id);
    Object.assign(school, updateSchoolDto);
    return this.schoolsRepository.save(school);
  }

  async remove(id: string): Promise<void> {
    const school = await this.findById(id);
    await this.schoolsRepository.remove(school);
  }

  async getStats(schoolId: string): Promise<any> {
    // Implement school statistics logic
    return {
      totalStudents: 0,
      totalTeachers: 0,
      totalClasses: 0,
    };
  }
}
