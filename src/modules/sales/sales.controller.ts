import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
    Query,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse as SwaggerResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleResponseDto } from './dto/sale-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { plainToInstance } from 'class-transformer';
import { ApiResponse } from '../../common/helpers/api-response.helper';

@ApiTags('sales')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('sales')
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CASHIER)
    @ApiOperation({ summary: 'Create a new sale (automatically reduces stock)' })
    @SwaggerResponse({
        status: 201,
        description: 'Sale created successfully and stock reduced',
        type: SaleResponseDto,
    })
    @SwaggerResponse({ status: 400, description: 'Insufficient stock or invalid payment' })
    async create(@Body() createSaleDto: CreateSaleDto) {
        const sale = await this.salesService.create(createSaleDto);
        return ApiResponse.created(
            plainToInstance(SaleResponseDto, sale),
            'Sale created successfully and stock reduced',
        );
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CASHIER)
    @ApiOperation({ summary: 'Get all sales with pagination' })
    @SwaggerResponse({
        status: 200,
        description: 'List of sales',
        type: [SaleResponseDto],
    })
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search?: string,
        @Query('date') date?: string,
    ) {
        const result = await this.salesService.findAll(page, limit, search, date);
        return ApiResponse.success(
            result, // service now returns { data, meta }
            'Sales retrieved successfully',
        );
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CASHIER)
    @ApiOperation({ summary: 'Get sale by ID' })
    @SwaggerResponse({
        status: 200,
        description: 'Sale found',
        type: SaleResponseDto,
    })
    @SwaggerResponse({ status: 404, description: 'Sale not found' })
    async findOne(@Param('id') id: string) {
        const sale = await this.salesService.findOne(id);
        return ApiResponse.success(
            plainToInstance(SaleResponseDto, sale),
            'Sale retrieved successfully',
        );
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete sale (soft delete)' })
    @SwaggerResponse({ status: 200, description: 'Sale deleted successfully' })
    @SwaggerResponse({ status: 404, description: 'Sale not found' })
    async remove(@Param('id') id: string) {
        await this.salesService.remove(id);
        return ApiResponse.deleted('Sale deleted successfully');
    }
}
