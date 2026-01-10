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
import { CashRegistersService } from './cash-registers.service';
import { CreateCashRegisterDto, CloseCashRegisterDto } from './dto/create-cash-register.dto';
import { CashRegisterResponseDto } from './dto/cash-register-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import { plainToInstance } from 'class-transformer';
import { ApiResponse } from '../../common/helpers/api-response.helper';

@ApiTags('cash-registers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('cash-registers')
export class CashRegistersController {
    constructor(private readonly cashRegistersService: CashRegistersService) { }

    @Post('open')
    @Roles(UserRole.ADMIN, UserRole.CASHIER)
    @ApiOperation({ summary: 'Open a new cash register' })
    @SwaggerResponse({
        status: 201,
        description: 'Cash register opened successfully',
        type: CashRegisterResponseDto,
    })
    @SwaggerResponse({ status: 400, description: 'User already has an open cash register' })
    async open(@Body() createCashRegisterDto: CreateCashRegisterDto) {
        const cashRegister = await this.cashRegistersService.open(createCashRegisterDto);
        return ApiResponse.created(
            plainToInstance(CashRegisterResponseDto, cashRegister),
            'Cash register opened successfully',
        );
    }

    @Patch(':id/close')
    @Roles(UserRole.ADMIN, UserRole.CASHIER)
    @ApiOperation({ summary: 'Close a cash register' })
    @SwaggerResponse({
        status: 200,
        description: 'Cash register closed successfully',
        type: CashRegisterResponseDto,
    })
    @SwaggerResponse({ status: 400, description: 'Cash register already closed' })
    async close(@Param('id') id: string, @Body() closeCashRegisterDto: CloseCashRegisterDto) {
        const cashRegister = await this.cashRegistersService.close(id, closeCashRegisterDto);
        return ApiResponse.updated(
            plainToInstance(CashRegisterResponseDto, cashRegister),
            'Cash register closed successfully',
        );
    }

    @Get()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get all cash registers' })
    @SwaggerResponse({
        status: 200,
        description: 'List of cash registers',
        type: [CashRegisterResponseDto],
    })
    async findAll() {
        const cashRegisters = await this.cashRegistersService.findAll();
        return ApiResponse.success(
            plainToInstance(CashRegisterResponseDto, cashRegisters),
            'Cash registers retrieved successfully',
        );
    }

    @Get('open')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get all open cash registers' })
    @SwaggerResponse({
        status: 200,
        description: 'List of open cash registers',
        type: [CashRegisterResponseDto],
    })
    async findOpen() {
        const cashRegisters = await this.cashRegistersService.findOpen();
        return ApiResponse.success(
            plainToInstance(CashRegisterResponseDto, cashRegisters),
            'Open cash registers retrieved successfully',
        );
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.CASHIER)
    @ApiOperation({ summary: 'Get cash register by ID' })
    @SwaggerResponse({
        status: 200,
        description: 'Cash register found',
        type: CashRegisterResponseDto,
    })
    @SwaggerResponse({ status: 404, description: 'Cash register not found' })
    async findOne(@Param('id') id: string) {
        const cashRegister = await this.cashRegistersService.findOne(id);
        return ApiResponse.success(
            plainToInstance(CashRegisterResponseDto, cashRegister),
            'Cash register retrieved successfully',
        );
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete cash register (soft delete)' })
    @SwaggerResponse({ status: 200, description: 'Cash register deleted successfully' })
    @SwaggerResponse({ status: 400, description: 'Cannot delete an open cash register' })
    @SwaggerResponse({ status: 404, description: 'Cash register not found' })
    async remove(@Param('id') id: string) {
        await this.cashRegistersService.remove(id);
        return ApiResponse.deleted('Cash register deleted successfully');
    }
}
