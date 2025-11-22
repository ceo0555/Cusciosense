import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { UserService } from './user.service'
import { JwtAuthGuard } from '@/guards/jwt-auth.guard'
import { CurrentUser } from '@/decorators/current-user.decorator'
import { User } from './entities/user.entity'

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: User) {
    return this.userService.findOne(user.id)
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll(@Query() query: any) {
    return this.userService.findAll(query)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(@CurrentUser() user: User, @Body() updateData: any) {
    return this.userService.update(user.id, updateData)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.userService.update(id, updateData)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  async remove(@Param('id') id: string) {
    return this.userService.remove(id)
  }
}
