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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { plainToInstance } from 'class-transformer';
import { ApiResponse } from '../../common/helpers/api-response.helper';

@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a new category' })
    @SwaggerResponse({
        status: 201,
        description: 'Category created successfully',
        type: CategoryResponseDto,
    })
    @SwaggerResponse({ status: 409, description: 'Category name already exists' })
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        const category = await this.categoriesService.create(createCategoryDto);
        return ApiResponse.created(
            plainToInstance(CategoryResponseDto, category),
            'Category created successfully',
        );
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
    @ApiOperation({ summary: 'Get all categories' })
    @SwaggerResponse({
        status: 200,
        description: 'List of categories',
        type: [CategoryResponseDto],
    })
    async findAll() {
        const categories = await this.categoriesService.findAll();
        return ApiResponse.success(
            plainToInstance(CategoryResponseDto, categories),
            'Categories retrieved successfully',
        );
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
    @ApiOperation({ summary: 'Get category by ID' })
    @SwaggerResponse({
        status: 200,
        description: 'Category found',
        type: CategoryResponseDto,
    })
    @SwaggerResponse({ status: 404, description: 'Category not found' })
    async findOne(@Param('id') id: string) {
        const category = await this.categoriesService.findOne(id);
        return ApiResponse.success(
            plainToInstance(CategoryResponseDto, category),
            'Category retrieved successfully',
        );
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update category' })
    @SwaggerResponse({
        status: 200,
        description: 'Category updated successfully',
        type: CategoryResponseDto,
    })
    @SwaggerResponse({ status: 404, description: 'Category not found' })
    async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        const category = await this.categoriesService.update(id, updateCategoryDto);
        return ApiResponse.updated(
            plainToInstance(CategoryResponseDto, category),
            'Category updated successfully',
        );
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete category (soft delete)' })
    @SwaggerResponse({ status: 200, description: 'Category deleted successfully' })
    @SwaggerResponse({ status: 404, description: 'Category not found' })
    async remove(@Param('id') id: string) {
        await this.categoriesService.remove(id);
        return ApiResponse.deleted('Category deleted successfully');
    }
}
