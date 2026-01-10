import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Excepción base para errores de lógica de negocio.
 * 
 * HTTP Status: 400 Bad Request
 */
export class BusinessLogicException extends HttpException {
    constructor(message: string, metadata?: Record<string, any>) {
        super(
            {
                message,
                code: 'BUSINESS_LOGIC_ERROR',
                ...metadata,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}

/**
 * Excepción lanzada cuando un recurso no es encontrado.
 * 
 * HTTP Status: 404 Not Found
 * 
 * Ejemplos de uso:
 * - Usuario no encontrado
 * - Branch no encontrada
 * - Cualquier registro de base de datos inexistente
 */
export class ResourceNotFoundException extends HttpException {
    constructor(resourceType: string, identifier?: string) {
        const message = identifier
            ? `El recurso ${resourceType} con identificador ${identifier} no existe en el sistema.`
            : `El recurso ${resourceType} solicitado no existe en el sistema.`;

        super(
            {
                message,
                code: 'RESOURCE_NOT_FOUND',
                details: {
                    resource_type: resourceType,
                    identifier,
                    message: `No se encontró el ${resourceType} solicitado.`,
                },
            },
            HttpStatus.NOT_FOUND,
        );
    }

    /**
     * Helper para crear excepción de usuario no encontrado.
     */
    static user(identifier: string | number): ResourceNotFoundException {
        return new ResourceNotFoundException('User', String(identifier));
    }

    /**
     * Helper para crear excepción de branch no encontrada.
     */
    static branch(identifier: string | number): ResourceNotFoundException {
        return new ResourceNotFoundException('Branch', String(identifier));
    }

    /**
     * Helper para crear excepción de rol no encontrado.
     */
    static role(identifier: string | number): ResourceNotFoundException {
        return new ResourceNotFoundException('Role', String(identifier));
    }

    /**
     * Helper para crear excepción de producto no encontrado.
     */
    static product(identifier: string | number): ResourceNotFoundException {
        return new ResourceNotFoundException('Product', String(identifier));
    }

    /**
     * Helper para crear excepción de categoría no encontrada.
     */
    static category(identifier: string | number): ResourceNotFoundException {
        return new ResourceNotFoundException('Category', String(identifier));
    }

    /**
     * Helper para crear excepción de proveedor no encontrado.
     */
    static supplier(identifier: string | number): ResourceNotFoundException {
        return new ResourceNotFoundException('Supplier', String(identifier));
    }

    /**
     * Helper para crear excepción de cliente no encontrado.
     */
    static customer(identifier: string | number): ResourceNotFoundException {
        return new ResourceNotFoundException('Customer', String(identifier));
    }

    /**
     * Helper para crear excepción de venta no encontrada.
     */
    static sale(identifier: string | number): ResourceNotFoundException {
        return new ResourceNotFoundException('Sale', String(identifier));
    }

    /**
     * Helper genérico para cualquier recurso.
     */
    static model(modelName: string, identifier: string | number): ResourceNotFoundException {
        return new ResourceNotFoundException(modelName, String(identifier));
    }
}

/**
 * Excepción lanzada cuando un usuario no está autenticado.
 * 
 * HTTP Status: 401 Unauthorized
 */
export class UnauthorizedException extends HttpException {
    constructor(message: string = 'No autenticado. Por favor, inicie sesión.') {
        super(
            {
                message,
                code: 'UNAUTHENTICATED',
            },
            HttpStatus.UNAUTHORIZED,
        );
    }

    static invalidCredentials(): UnauthorizedException {
        return new UnauthorizedException('Credenciales inválidas.');
    }

    static tokenExpired(): UnauthorizedException {
        return new UnauthorizedException('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
    }

    static invalidToken(): UnauthorizedException {
        return new UnauthorizedException('Token inválido o malformado.');
    }
}

/**
 * Excepción lanzada cuando un usuario no tiene autorización para realizar una acción.
 * 
 * HTTP Status: 403 Forbidden
 * 
 * Ejemplos de uso:
 * - Intentar acceder a recursos de otra compañía
 * - Permisos insuficientes para ejecutar acción
 * - Violación de políticas de autorización
 */
export class ForbiddenException extends HttpException {
    constructor(message: string = 'No tiene autorización para realizar esta acción.', metadata?: Record<string, any>) {
        super(
            {
                message,
                code: 'FORBIDDEN',
                ...metadata,
            },
            HttpStatus.FORBIDDEN,
        );
    }

    /**
     * Helper para acceso a recursos de otra compañía.
     */
    static differentCompany(resourceType: string = 'recurso'): ForbiddenException {
        return new ForbiddenException(
            `No tiene autorización para acceder a este ${resourceType}.`,
            {
                reason: 'different_company',
                details: {
                    message: `El ${resourceType} pertenece a una compañía diferente a la suya.`,
                },
            },
        );
    }

    /**
     * Helper para permisos insuficientes.
     */
    static insufficientPermissions(action: string, resource: string = 'recurso'): ForbiddenException {
        return new ForbiddenException(
            `No tiene los permisos necesarios para ${action} este ${resource}.`,
            {
                reason: 'insufficient_permissions',
                action,
                resource,
            },
        );
    }

    /**
     * Helper para acciones sobre el propio usuario.
     */
    static cannotModifySelf(action: string = 'modificar'): ForbiddenException {
        return new ForbiddenException(
            `No puede ${action} su propio usuario.`,
            {
                reason: 'self_modification_not_allowed',
                action,
            },
        );
    }

    /**
     * Helper para recursos bloqueados.
     */
    static resourceLocked(resourceType: string, reason: string): ForbiddenException {
        return new ForbiddenException(
            `El ${resourceType} está bloqueado y no puede ser modificado.`,
            {
                reason: 'resource_locked',
                resource_type: resourceType,
                lock_reason: reason,
            },
        );
    }

    /**
     * Helper para acceso denegado por rol.
     */
    static roleNotAllowed(requiredRole: string): ForbiddenException {
        return new ForbiddenException(
            `Esta acción requiere el rol de ${requiredRole}.`,
            {
                reason: 'role_not_allowed',
                required_role: requiredRole,
            },
        );
    }
}

/**
 * Excepción para conflictos (ej: email duplicado).
 * 
 * HTTP Status: 409 Conflict
 */
export class ConflictException extends HttpException {
    constructor(message: string, metadata?: Record<string, any>) {
        super(
            {
                message,
                code: 'CONFLICT',
                ...metadata,
            },
            HttpStatus.CONFLICT,
        );
    }

    static duplicateResource(resourceType: string, field: string, value: string): ConflictException {
        return new ConflictException(
            `Ya existe un ${resourceType} con ${field}: ${value}`,
            {
                reason: 'duplicate_resource',
                resource_type: resourceType,
                field,
                value,
            },
        );
    }
}
