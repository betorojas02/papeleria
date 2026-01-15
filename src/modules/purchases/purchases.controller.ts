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
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchaseResponseDto } from './dto/purchase-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { plainToInstance } from 'class-transformer';
import { ApiResponse } from '../../common/helpers/api-response.helper';

@ApiTags('purchases')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('purchases')
export class PurchasesController {
    constructor(private readonly purchasesService: PurchasesService) { }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
    @ApiOperation({ summary: 'Create a new purchase (automatically updates stock)' })
    @SwaggerResponse({
        status: 201,
        description: 'Purchase created successfully and stock updated',
        type: PurchaseResponseDto,
    })
    async create(@Body() createPurchaseDto: CreatePurchaseDto) {
        const purchase = await this.purchasesService.create(createPurchaseDto);
        return ApiResponse.created(
            plainToInstance(PurchaseResponseDto, purchase),
            'Purchase created successfully and stock updated',
        );
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
    @ApiOperation({ summary: 'Get all purchases' })
    @SwaggerResponse({
        status: 200,
        description: 'List of purchases',
        type: [PurchaseResponseDto],
    })
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search?: string,
    ) {
        const result = await this.purchasesService.findAll(page, limit, search);
        return ApiResponse.success(
            result,
            'Purchases retrieved successfully',
        );
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
    @ApiOperation({ summary: 'Get purchase by ID' })
    @SwaggerResponse({
        status: 200,
        description: 'Purchase found',
        type: PurchaseResponseDto,
    })
    @SwaggerResponse({ status: 404, description: 'Purchase not found' })
    async findOne(@Param('id') id: string) {
        const purchase = await this.purchasesService.findOne(id);
        return ApiResponse.success(
            plainToInstance(PurchaseResponseDto, purchase),
            'Purchase retrieved successfully',
        );
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete purchase (soft delete)' })
    @SwaggerResponse({ status: 200, description: 'Purchase deleted successfully' })
    @SwaggerResponse({ status: 404, description: 'Purchase not found' })
    async remove(@Param('id') id: string) {
        await this.purchasesService.remove(id);
        return ApiResponse.deleted('Purchase deleted successfully');
    }
}
