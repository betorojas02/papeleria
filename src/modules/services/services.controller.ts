import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceResponseDto } from './dto/service-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { ApiResponse } from '../../common/helpers/api-response.helper';

@ApiTags('Services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a new service' })
    @SwaggerResponse({
        status: 201,
        description: 'Service created successfully',
        type: ServiceResponseDto,
    })
    async create(@Body() createServiceDto: CreateServiceDto) {
        const service = await this.servicesService.create(createServiceDto);
        return ApiResponse.success(service, 'Service created successfully');
    }

    @Get()
    @ApiOperation({ summary: 'Get all active services' })
    @SwaggerResponse({
        status: 200,
        description: 'List of services',
        type: [ServiceResponseDto],
    })
    async findAll() {
        const services = await this.servicesService.findAll();
        return ApiResponse.success(services, 'Services retrieved successfully');
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get service by ID' })
    @SwaggerResponse({
        status: 200,
        description: 'Service details',
        type: ServiceResponseDto,
    })
    async findOne(@Param('id') id: string) {
        const service = await this.servicesService.findOne(id);
        return ApiResponse.success(service, 'Service retrieved successfully');
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update service' })
    @SwaggerResponse({
        status: 200,
        description: 'Service updated successfully',
        type: ServiceResponseDto,
    })
    async update(
        @Param('id') id: string,
        @Body() updateServiceDto: UpdateServiceDto,
    ) {
        const service = await this.servicesService.update(id, updateServiceDto);
        return ApiResponse.success(service, 'Service updated successfully');
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete service' })
    @SwaggerResponse({
        status: 200,
        description: 'Service deleted successfully',
    })
    async remove(@Param('id') id: string) {
        await this.servicesService.remove(id);
        return ApiResponse.success(null, 'Service deleted successfully');
    }
}
