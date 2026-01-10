import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Request,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse as SwaggerResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiResponse } from '../../common/helpers/api-response.helper';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @SwaggerResponse({
        status: 200,
        description: 'Login successful',
    })
    @SwaggerResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() loginDto: LoginDto) {
        const result = await this.authService.login(loginDto);
        return ApiResponse.success(result, 'Login successful');
    }

    @Post('register')
    @ApiOperation({ summary: 'Register new user' })
    @SwaggerResponse({
        status: 201,
        description: 'User registered successfully',
    })
    @SwaggerResponse({ status: 409, description: 'Email already exists' })
    async register(@Body() registerDto: RegisterDto) {
        const result = await this.authService.register(registerDto);
        return ApiResponse.created(result, 'User registered successfully');
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Refresh access token' })
    @SwaggerResponse({
        status: 200,
        description: 'Token refreshed successfully',
    })
    @SwaggerResponse({ status: 401, description: 'Invalid refresh token' })
    async refresh(@Body('refresh_token') refreshToken: string) {
        const result = await this.authService.refreshToken(refreshToken);
        return ApiResponse.success(result, 'Token refreshed successfully');
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    @SwaggerResponse({
        status: 200,
        description: 'Profile retrieved successfully',
    })
    async getProfile(@CurrentUser('id') userId: string) {
        const profile = await this.authService.getProfile(userId);
        return ApiResponse.success(profile, 'Profile retrieved successfully');
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Logout user' })
    @SwaggerResponse({
        status: 200,
        description: 'Logout successful',
    })
    async logout() {
        // En un sistema real, aquí invalidarías el token
        // Por ahora, solo retornamos un mensaje
        return ApiResponse.success(null, 'Logout successful');
    }
}
