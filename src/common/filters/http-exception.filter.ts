import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    UnauthorizedException,
    ForbiddenException,
    NotFoundException,
    BadRequestException,
    ConflictException,
    Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

/**
 * Handler centralizado de excepciones para la API.
 * 
 * Equivalente al Handler de Laravel, proporciona:
 * - Formateo consistente de respuestas de error
 * - Logging estructurado con contexto
 * - Manejo de excepciones de NestJS y personalizadas
 * - Ocultamiento de información sensible en producción
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // Manejar excepciones específicas
        if (exception instanceof UnauthorizedException) {
            return this.handleAuthenticationException(exception, response, request);
        }

        if (exception instanceof ForbiddenException) {
            return this.handleAuthorizationException(exception, response, request);
        }

        if (exception instanceof NotFoundException) {
            return this.handleNotFoundException(exception, response, request);
        }

        if (exception instanceof BadRequestException) {
            return this.handleValidationException(exception, response, request);
        }

        if (exception instanceof ConflictException) {
            return this.handleConflictException(exception, response, request);
        }

        if (exception instanceof HttpException) {
            return this.handleHttpException(exception, response, request);
        }

        // Excepción genérica
        return this.handleGenericException(exception, response, request);
    }

    /**
     * Maneja excepciones de validación (400/422).
     */
    private handleValidationException(
        exception: BadRequestException,
        response: Response,
        request: Request,
    ) {
        const exceptionResponse: any = exception.getResponse();
        const errors = exceptionResponse.message || exceptionResponse;

        response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
            success: false,
            message: 'Los datos proporcionados no son válidos.',
            error: {
                code: 'VALIDATION_ERROR',
                type: 'ValidationException',
                status: HttpStatus.UNPROCESSABLE_ENTITY,
                errors: Array.isArray(errors) ? errors : [errors],
                timestamp: new Date().toISOString(),
                path: request.url,
            },
        });
    }

    /**
     * Maneja excepciones de autenticación (401).
     */
    private handleAuthenticationException(
        exception: UnauthorizedException,
        response: Response,
        request: Request,
    ) {
        response.status(HttpStatus.UNAUTHORIZED).json({
            success: false,
            message: 'No autenticado. Por favor, inicie sesión.',
            error: {
                code: 'UNAUTHENTICATED',
                type: 'AuthenticationException',
                status: HttpStatus.UNAUTHORIZED,
                timestamp: new Date().toISOString(),
                path: request.url,
            },
        });
    }

    /**
     * Maneja excepciones de autorización (403).
     */
    private handleAuthorizationException(
        exception: ForbiddenException,
        response: Response,
        request: Request,
    ) {
        response.status(HttpStatus.FORBIDDEN).json({
            success: false,
            message: exception.message || 'No tiene autorización para realizar esta acción.',
            error: {
                code: 'FORBIDDEN',
                type: 'AuthorizationException',
                status: HttpStatus.FORBIDDEN,
                timestamp: new Date().toISOString(),
                path: request.url,
            },
        });
    }

    /**
     * Maneja excepciones 404.
     */
    private handleNotFoundException(
        exception: NotFoundException,
        response: Response,
        request: Request,
    ) {
        const exceptionResponse: any = exception.getResponse();
        const isResourceNotFound = exceptionResponse.code === 'RESOURCE_NOT_FOUND';

        response.status(HttpStatus.NOT_FOUND).json({
            success: false,
            message: isResourceNotFound
                ? exceptionResponse.message
                : 'El endpoint solicitado no existe.',
            error: {
                code: isResourceNotFound ? 'RESOURCE_NOT_FOUND' : 'ENDPOINT_NOT_FOUND',
                type: 'NotFoundException',
                status: HttpStatus.NOT_FOUND,
                details: isResourceNotFound ? exceptionResponse.details : {
                    url: request.url,
                    method: request.method,
                },
                timestamp: new Date().toISOString(),
                path: request.url,
            },
        });
    }

    /**
     * Maneja excepciones de conflicto (409).
     */
    private handleConflictException(
        exception: ConflictException,
        response: Response,
        request: Request,
    ) {
        response.status(HttpStatus.CONFLICT).json({
            success: false,
            message: exception.message,
            error: {
                code: 'CONFLICT',
                type: 'ConflictException',
                status: HttpStatus.CONFLICT,
                timestamp: new Date().toISOString(),
                path: request.url,
            },
        });
    }

    /**
     * Maneja excepciones HTTP genéricas.
     */
    private handleHttpException(
        exception: HttpException,
        response: Response,
        request: Request,
    ) {
        const status = exception.getStatus();
        const exceptionResponse: any = exception.getResponse();

        response.status(status).json({
            success: false,
            message: exceptionResponse.message || exception.message || 'Ha ocurrido un error en el servidor.',
            error: {
                code: this.getErrorCode(status),
                type: 'HttpException',
                status,
                timestamp: new Date().toISOString(),
                path: request.url,
                ...(exceptionResponse.errors && { errors: exceptionResponse.errors }),
            },
        });
    }

    /**
     * Maneja excepciones genéricas (500).
     */
    private handleGenericException(
        exception: unknown,
        response: Response,
        request: Request,
    ) {
        const error = exception as Error;
        const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        const message = 'Ha ocurrido un error interno en el servidor.';

        const errorResponse: any = {
            success: false,
            message,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                type: error.constructor?.name || 'Error',
                status: statusCode,
                timestamp: new Date().toISOString(),
                path: request.url,
            },
        };

        // En desarrollo, mostrar detalles del error
        if (process.env.NODE_ENV === 'development') {
            errorResponse.error.message = error.message;
            errorResponse.error.stack = error.stack?.split('\n').slice(0, 10);
        }

        // Log del error con contexto
        this.logger.error('Unhandled exception', {
            exception: error.constructor?.name,
            message: error.message,
            stack: error.stack,
            url: request.url,
            method: request.method,
            ip: request.ip,
            userAgent: request.get('user-agent'),
        });

        response.status(statusCode).json(errorResponse);
    }

    /**
     * Obtiene el código de error basado en el status HTTP.
     */
    private getErrorCode(status: number): string {
        switch (status) {
            case HttpStatus.BAD_REQUEST:
                return 'BAD_REQUEST';
            case HttpStatus.UNAUTHORIZED:
                return 'UNAUTHORIZED';
            case HttpStatus.FORBIDDEN:
                return 'FORBIDDEN';
            case HttpStatus.NOT_FOUND:
                return 'NOT_FOUND';
            case HttpStatus.UNPROCESSABLE_ENTITY:
                return 'VALIDATION_ERROR';
            case HttpStatus.CONFLICT:
                return 'CONFLICT';
            case HttpStatus.INTERNAL_SERVER_ERROR:
                return 'INTERNAL_SERVER_ERROR';
            default:
                return 'HTTP_EXCEPTION';
        }
    }
}
