import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessLogicException extends HttpException {
    constructor(message: string, metadata?: Record<string, any>) {
        super(
            {
                message,
                error: 'BUSINESS_LOGIC_ERROR',
                metadata,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}

export class ResourceNotFoundException extends HttpException {
    constructor(resource: string, id?: string | number) {
        super(
            {
                message: `${resource} not found${id ? ` with id: ${id}` : ''}`,
                error: 'RESOURCE_NOT_FOUND',
                resource,
                id,
            },
            HttpStatus.NOT_FOUND,
        );
    }
}

export class UnauthorizedException extends HttpException {
    constructor(message: string = 'Unauthorized access') {
        super(
            {
                message,
                error: 'UNAUTHORIZED',
            },
            HttpStatus.UNAUTHORIZED,
        );
    }
}

export class ForbiddenException extends HttpException {
    constructor(message: string = 'Forbidden resource') {
        super(
            {
                message,
                error: 'FORBIDDEN',
            },
            HttpStatus.FORBIDDEN,
        );
    }
}
