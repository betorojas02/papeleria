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
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandResponseDto } from './dto/brand-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { plainToInstance } from 'class-transformer';
import { ApiResponse } from '../../common/helpers/api-response.helper';

@ApiTags('brands')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('brands')
export class BrandsController {
    constructor(private readonly brandsService: BrandsService) { }

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a new brand' })
    @SwaggerResponse({
        status: 201,
        description: 'Brand created successfully',
        type: BrandResponseDto,
    })
    @SwaggerResponse({ status: 409, description: 'Brand name already exists' })
    async create(@Body() createBrandDto: CreateBrandDto) {
        const brand = await this.brandsService.create(createBrandDto);
        return ApiResponse.created(
            plainToInstance(BrandResponseDto, brand),
            'Brand created successfully',
        );
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
    @ApiOperation({ summary: 'Get all brands' })
    @SwaggerResponse({
        status: 200,
        description: 'List of brands',
        type: [BrandResponseDto],
    })
    async findAll() {
        const brands = await this.brandsService.findAll();
        return ApiResponse.success(
            plainToInstance(BrandResponseDto, brands),
            'Brands retrieved successfully',
        );
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
    @ApiOperation({ summary: 'Get brand by ID' })
    @SwaggerResponse({
        status: 200,
        description: 'Brand found',
        type: BrandResponseDto,
    })
    @SwaggerResponse({ status: 404, description: 'Brand not found' })
    async findOne(@Param('id') id: string) {
        const brand = await this.brandsService.findOne(id);
        return ApiResponse.success(
            plainToInstance(BrandResponseDto, brand),
            'Brand retrieved successfully',
        );
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update brand' })
    @SwaggerResponse({
        status: 200,
        description: 'Brand updated successfully',
        type: BrandResponseDto,
    })
    @SwaggerResponse({ status: 404, description: 'Brand not found' })
    async update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
        const brand = await this.brandsService.update(id, updateBrandDto);
        return ApiResponse.updated(
            plainToInstance(BrandResponseDto, brand),
            'Brand updated successfully',
        );
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete brand (soft delete)' })
    @SwaggerResponse({ status: 200, description: 'Brand deleted successfully' })
    @SwaggerResponse({ status: 404, description: 'Brand not found' })
    async remove(@Param('id') id: string) {
        await this.brandsService.remove(id);
        return ApiResponse.deleted('Brand deleted successfully');
    }
}
