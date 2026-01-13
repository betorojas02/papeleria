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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { plainToInstance } from 'class-transformer';
import { ApiResponse } from '../../common/helpers/api-response.helper';

@ApiTags('products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a new product' })
    @SwaggerResponse({
        status: 201,
        description: 'Product created successfully',
        type: ProductResponseDto,
    })
    @SwaggerResponse({ status: 409, description: 'Product barcode already exists' })
    async create(@Body() createProductDto: CreateProductDto) {
        const product = await this.productsService.create(createProductDto);
        return ApiResponse.created(
            plainToInstance(ProductResponseDto, product),
            'Product created successfully',
        );
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CASHIER)
    @ApiOperation({ summary: 'Get all products' })
    @SwaggerResponse({
        status: 200,
        description: 'List of products',
        type: [ProductResponseDto],
    })
    async findAll() {
        const products = await this.productsService.findAll();
        return ApiResponse.success(
            plainToInstance(ProductResponseDto, products),
            'Products retrieved successfully',
        );
    }

    @Get('low-stock')
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
    @ApiOperation({ summary: 'Get products with low stock' })
    @SwaggerResponse({
        status: 200,
        description: 'List of products with low stock',
        type: [ProductResponseDto],
    })
    async findLowStock() {
        const products = await this.productsService.findLowStock();
        return ApiResponse.success(
            plainToInstance(ProductResponseDto, products),
            'Low stock products retrieved successfully',
        );
    }

    @Get('category/:categoryId')
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CASHIER)
    @ApiOperation({ summary: 'Get products by category' })
    @SwaggerResponse({
        status: 200,
        description: 'List of products in category',
        type: [ProductResponseDto],
    })
    async findByCategory(@Param('categoryId') categoryId: string) {
        const products = await this.productsService.findByCategory(categoryId);
        return ApiResponse.success(
            plainToInstance(ProductResponseDto, products),
            'Products by category retrieved successfully',
        );
    }

    @Get('brand/:brandId')
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CASHIER)
    @ApiOperation({ summary: 'Get products by brand' })
    @SwaggerResponse({
        status: 200,
        description: 'List of products by brand',
        type: [ProductResponseDto],
    })
    async findByBrand(@Param('brandId') brandId: string) {
        const products = await this.productsService.findByBrand(brandId);
        return ApiResponse.success(
            plainToInstance(ProductResponseDto, products),
            'Products by brand retrieved successfully',
        );
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CASHIER)
    @ApiOperation({ summary: 'Get product by ID' })
    @SwaggerResponse({
        status: 200,
        description: 'Product found',
        type: ProductResponseDto,
    })
    @SwaggerResponse({ status: 404, description: 'Product not found' })
    async findOne(@Param('id') id: string) {
        const product = await this.productsService.findOne(id);
        return ApiResponse.success(
            plainToInstance(ProductResponseDto, product),
            'Product retrieved successfully',
        );
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update product' })
    @SwaggerResponse({
        status: 200,
        description: 'Product updated successfully',
        type: ProductResponseDto,
    })
    @SwaggerResponse({ status: 404, description: 'Product not found' })
    async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        const product = await this.productsService.update(id, updateProductDto);
        return ApiResponse.updated(
            plainToInstance(ProductResponseDto, product),
            'Product updated successfully',
        );
    }

    @Patch(':id/stock')
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
    @ApiOperation({ summary: 'Update product stock' })
    @SwaggerResponse({
        status: 200,
        description: 'Stock updated successfully',
        type: ProductResponseDto,
    })
    @SwaggerResponse({ status: 404, description: 'Product not found' })
    @SwaggerResponse({ status: 400, description: 'Insufficient stock or invalid operation' })
    async updateStock(
        @Param('id') id: string,
        @Body('quantity') quantity: number,
    ) {
        const product = await this.productsService.updateStock(id, quantity);
        return ApiResponse.updated(
            plainToInstance(ProductResponseDto, product),
            'Stock updated successfully',
        );
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete product (soft delete)' })
    @SwaggerResponse({ status: 200, description: 'Product deleted successfully' })
    @SwaggerResponse({ status: 404, description: 'Product not found' })
    async remove(@Param('id') id: string) {
        await this.productsService.remove(id);
        return ApiResponse.deleted('Product deleted successfully');
    }
}
