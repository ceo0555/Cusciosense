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
import { HomeworkService } from './homework.service'
import { JwtAuthGuard } from '@/guards/jwt-auth.guard'

@ApiTags('homework')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('homework')
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @Post()
  @ApiOperation({ summary: 'Create homework assignment' })
  async create(@Body() createData: any) {
    return this.homeworkService.create(createData)
  }

  @Get()
  @ApiOperation({ summary: 'Get all homework assignments' })
  async findAll(@Query() query: any) {
    return this.homeworkService.findAll(query)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get homework by ID' })
  async findOne(@Param('id') id: string) {
    return this.homeworkService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update homework' })
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.homeworkService.update(id, updateData)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete homework' })
  async remove(@Param('id') id: string) {
    return this.homeworkService.remove(id)
  }
}
