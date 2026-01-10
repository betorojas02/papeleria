import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.message
                : 'Internal server error';

        const errorResponse = exception instanceof HttpException
            ? (exception.getResponse() as any)
            : null;

        response.status(status).json({
            success: false,
            message: errorResponse?.message || message,
            error: {
                code: this.getErrorCode(exception),
                type: exception.constructor.name,
                status,
                timestamp: new Date().toISOString(),
                path: request.url,
                ...(errorResponse?.errors && { errors: errorResponse.errors }),
            },
        });
    }

    private getErrorCode(exception: unknown): string {
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
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
                default:
                    return 'HTTP_EXCEPTION';
            }
        }
        return 'INTERNAL_SERVER_ERROR';
    }
}
