import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { SchoolService } from './school.service'
import { CreateSchoolDto } from './dto/create-school.dto'
import { UpdateSchoolDto } from './dto/update-school.dto'
import { JwtAuthGuard } from '@/guards/jwt-auth.guard'

@ApiTags('schools')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('schools')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new school' })
  async create(@Body() createSchoolDto: CreateSchoolDto) {
    return this.schoolService.create(createSchoolDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all schools' })
  async findAll(@Query() query: any) {
    return this.schoolService.findAll(query)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get school by ID' })
  async findOne(@Param('id') id: string) {
    return this.schoolService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update school' })
  async update(
    @Param('id') id: string,
    @Body() updateSchoolDto: UpdateSchoolDto,
  ) {
    return this.schoolService.update(id, updateSchoolDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete school' })
  async remove(@Param('id') id: string) {
    return this.schoolService.remove(id)
  }
}
