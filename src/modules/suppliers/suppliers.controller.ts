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
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierResponseDto } from './dto/supplier-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { plainToInstance } from 'class-transformer';
import { ApiResponse } from '../../common/helpers/api-response.helper';

@ApiTags('suppliers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('suppliers')
export class SuppliersController {
    constructor(private readonly suppliersService: SuppliersService) { }

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a new supplier' })
    @SwaggerResponse({
        status: 201,
        description: 'Supplier created successfully',
        type: SupplierResponseDto,
    })
    @SwaggerResponse({ status: 409, description: 'Supplier taxId already exists' })
    async create(@Body() createSupplierDto: CreateSupplierDto) {
        const supplier = await this.suppliersService.create(createSupplierDto);
        return ApiResponse.created(
            plainToInstance(SupplierResponseDto, supplier),
            'Supplier created successfully',
        );
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
    @ApiOperation({ summary: 'Get all suppliers' })
    @SwaggerResponse({
        status: 200,
        description: 'List of suppliers',
        type: [SupplierResponseDto],
    })
    async findAll() {
        const suppliers = await this.suppliersService.findAll();
        return ApiResponse.success(
            plainToInstance(SupplierResponseDto, suppliers),
            'Suppliers retrieved successfully',
        );
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
    @ApiOperation({ summary: 'Get supplier by ID' })
    @SwaggerResponse({
        status: 200,
        description: 'Supplier found',
        type: SupplierResponseDto,
    })
    @SwaggerResponse({ status: 404, description: 'Supplier not found' })
    async findOne(@Param('id') id: string) {
        const supplier = await this.suppliersService.findOne(id);
        return ApiResponse.success(
            plainToInstance(SupplierResponseDto, supplier),
            'Supplier retrieved successfully',
        );
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update supplier' })
    @SwaggerResponse({
        status: 200,
        description: 'Supplier updated successfully',
        type: SupplierResponseDto,
    })
    @SwaggerResponse({ status: 404, description: 'Supplier not found' })
    async update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
        const supplier = await this.suppliersService.update(id, updateSupplierDto);
        return ApiResponse.updated(
            plainToInstance(SupplierResponseDto, supplier),
            'Supplier updated successfully',
        );
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete supplier (soft delete)' })
    @SwaggerResponse({ status: 200, description: 'Supplier deleted successfully' })
    @SwaggerResponse({ status: 404, description: 'Supplier not found' })
    async remove(@Param('id') id: string) {
        await this.suppliersService.remove(id);
        return ApiResponse.deleted('Supplier deleted successfully');
    }
}
