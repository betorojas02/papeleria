import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse as SwaggerResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { plainToInstance } from 'class-transformer';
import { ApiResponse } from '../../common/helpers/api-response.helper';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a new user' })
    @SwaggerResponse({
        status: 201,
        description: 'User created successfully',
        type: UserResponseDto,
    })
    @SwaggerResponse({ status: 409, description: 'Email already exists' })
    async create(@Body() createUserDto: CreateUserDto) {
        const user = await this.usersService.create(createUserDto);
        return ApiResponse.created(
            plainToInstance(UserResponseDto, user),
            'User created successfully',
        );
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
    @ApiOperation({ summary: 'Get all users' })
    @SwaggerResponse({
        status: 200,
        description: 'List of users',
        type: [UserResponseDto],
    })
    async findAll() {
        const users = await this.usersService.findAll();
        return ApiResponse.success(
            plainToInstance(UserResponseDto, users),
            'Users retrieved successfully',
        );
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
    @ApiOperation({ summary: 'Get user by ID' })
    @SwaggerResponse({
        status: 200,
        description: 'User found',
        type: UserResponseDto,
    })
    @SwaggerResponse({ status: 404, description: 'User not found' })
    async findOne(@Param('id') id: string) {
        const user = await this.usersService.findOne(id);
        return ApiResponse.success(
            plainToInstance(UserResponseDto, user),
            'User retrieved successfully',
        );
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update user' })
    @SwaggerResponse({
        status: 200,
        description: 'User updated successfully',
        type: UserResponseDto,
    })
    @SwaggerResponse({ status: 404, description: 'User not found' })
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const user = await this.usersService.update(id, updateUserDto);
        return ApiResponse.updated(
            plainToInstance(UserResponseDto, user),
            'User updated successfully',
        );
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete user (soft delete)' })
    @SwaggerResponse({ status: 200, description: 'User deleted successfully' })
    @SwaggerResponse({ status: 404, description: 'User not found' })
    async remove(@Param('id') id: string) {
        await this.usersService.remove(id);
        return ApiResponse.deleted('User deleted successfully');
    }
}
