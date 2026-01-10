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
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { plainToInstance } from 'class-transformer';
import { ApiResponse } from '../../common/helpers/api-response.helper';

@ApiTags('customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('customers')
export class CustomersController {
    constructor(private readonly customersService: CustomersService) { }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
    @ApiOperation({ summary: 'Create a new customer' })
    @SwaggerResponse({
        status: 201,
        description: 'Customer created successfully',
        type: CustomerResponseDto,
    })
    @SwaggerResponse({ status: 409, description: 'Customer email already exists' })
    async create(@Body() createCustomerDto: CreateCustomerDto) {
        const customer = await this.customersService.create(createCustomerDto);
        return ApiResponse.created(
            plainToInstance(CustomerResponseDto, customer),
            'Customer created successfully',
        );
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CASHIER)
    @ApiOperation({ summary: 'Get all customers' })
    @SwaggerResponse({
        status: 200,
        description: 'List of customers',
        type: [CustomerResponseDto],
    })
    async findAll() {
        const customers = await this.customersService.findAll();
        return ApiResponse.success(
            plainToInstance(CustomerResponseDto, customers),
            'Customers retrieved successfully',
        );
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CASHIER)
    @ApiOperation({ summary: 'Get customer by ID' })
    @SwaggerResponse({
        status: 200,
        description: 'Customer found',
        type: CustomerResponseDto,
    })
    @SwaggerResponse({ status: 404, description: 'Customer not found' })
    async findOne(@Param('id') id: string) {
        const customer = await this.customersService.findOne(id);
        return ApiResponse.success(
            plainToInstance(CustomerResponseDto, customer),
            'Customer retrieved successfully',
        );
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
    @ApiOperation({ summary: 'Update customer' })
    @SwaggerResponse({
        status: 200,
        description: 'Customer updated successfully',
        type: CustomerResponseDto,
    })
    @SwaggerResponse({ status: 404, description: 'Customer not found' })
    async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
        const customer = await this.customersService.update(id, updateCustomerDto);
        return ApiResponse.updated(
            plainToInstance(CustomerResponseDto, customer),
            'Customer updated successfully',
        );
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete customer (soft delete)' })
    @SwaggerResponse({ status: 200, description: 'Customer deleted successfully' })
    @SwaggerResponse({ status: 404, description: 'Customer not found' })
    async remove(@Param('id') id: string) {
        await this.customersService.remove(id);
        return ApiResponse.deleted('Customer deleted successfully');
    }
}
