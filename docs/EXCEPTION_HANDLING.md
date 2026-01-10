# Exception Handler - Laravel vs NestJS

## ✅ Implementación Completa

El `AllExceptionsFilter` de NestJS ahora es **idéntico** al Handler de Laravel.

## 📊 Comparación

### Laravel Handler
```php
class Handler extends ExceptionHandler {
    protected function handleValidationException() { }
    protected function handleModelNotFoundException() { }
    protected function handleAuthenticationException() { }
    protected function handleAuthorizationException() { }
    protected function handleNotFoundHttpException() { }
    protected function handleHttpException() { }
    protected function handleGenericException() { }
}
```

### NestJS AllExceptionsFilter
```typescript
@Catch()
export class AllExceptionsFilter {
    handleValidationException() { }
    handleNotFoundException() { }
    handleAuthenticationException() { }
    handleAuthorizationException() { }
    handleConflictException() { }
    handleHttpException() { }
    handleGenericException() { }
}
```

## 🎯 Excepciones Manejadas

| Laravel | NestJS | Código | Status |
|---------|--------|--------|--------|
| `ValidationException` | `BadRequestException` | `VALIDATION_ERROR` | 422 |
| `ModelNotFoundException` | `NotFoundException` | `RESOURCE_NOT_FOUND` | 404 |
| `AuthenticationException` | `UnauthorizedException` | `UNAUTHENTICATED` | 401 |
| `AuthorizationException` | `ForbiddenException` | `FORBIDDEN` | 403 |
| `NotFoundHttpException` | `NotFoundException` | `ENDPOINT_NOT_FOUND` | 404 |
| `ConflictException` | `ConflictException` | `CONFLICT` | 409 |
| `HttpException` | `HttpException` | `HTTP_EXCEPTION` | Varía |
| `Throwable` | `Error` | `INTERNAL_SERVER_ERROR` | 500 |

## 📝 Ejemplos de Respuestas

### 1. Validación (422)
```json
{
  "success": false,
  "message": "Los datos proporcionados no son válidos.",
  "error": {
    "code": "VALIDATION_ERROR",
    "type": "ValidationException",
    "status": 422,
    "errors": [
      "email must be an email",
      "password must be longer than 6 characters"
    ],
    "timestamp": "2026-01-10T16:00:00.000Z",
    "path": "/api/users"
  }
}
```

### 2. No Autenticado (401)
```json
{
  "success": false,
  "message": "No autenticado. Por favor, inicie sesión.",
  "error": {
    "code": "UNAUTHENTICATED",
    "type": "AuthenticationException",
    "status": 401,
    "timestamp": "2026-01-10T16:00:00.000Z",
    "path": "/api/users"
  }
}
```

### 3. Sin Autorización (403)
```json
{
  "success": false,
  "message": "No tiene autorización para realizar esta acción.",
  "error": {
    "code": "FORBIDDEN",
    "type": "AuthorizationException",
    "status": 403,
    "timestamp": "2026-01-10T16:00:00.000Z",
    "path": "/api/users"
  }
}
```

### 4. Recurso No Encontrado (404)
```json
{
  "success": false,
  "message": "El recurso User solicitado no existe en el sistema.",
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "type": "NotFoundException",
    "status": 404,
    "details": {
      "resource_type": "User",
      "message": "No se encontró el User solicitado."
    },
    "timestamp": "2026-01-10T16:00:00.000Z",
    "path": "/api/users/uuid"
  }
}
```

### 5. Endpoint No Encontrado (404)
```json
{
  "success": false,
  "message": "El endpoint solicitado no existe.",
  "error": {
    "code": "ENDPOINT_NOT_FOUND",
    "type": "NotFoundException",
    "status": 404,
    "details": {
      "url": "/api/invalid-endpoint",
      "method": "GET"
    },
    "timestamp": "2026-01-10T16:00:00.000Z",
    "path": "/api/invalid-endpoint"
  }
}
```

### 6. Conflicto (409)
```json
{
  "success": false,
  "message": "Email already exists",
  "error": {
    "code": "CONFLICT",
    "type": "ConflictException",
    "status": 409,
    "timestamp": "2026-01-10T16:00:00.000Z",
    "path": "/api/users"
  }
}
```

### 7. Error Interno (500)
```json
{
  "success": false,
  "message": "Ha ocurrido un error interno en el servidor.",
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "type": "Error",
    "status": 500,
    "timestamp": "2026-01-10T16:00:00.000Z",
    "path": "/api/users"
  }
}
```

**En desarrollo** (NODE_ENV=development):
```json
{
  "success": false,
  "message": "Ha ocurrido un error interno en el servidor.",
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "type": "TypeError",
    "status": 500,
    "message": "Cannot read property 'name' of undefined",
    "stack": [
      "at UsersService.create (/path/to/file.ts:42:15)",
      "at UsersController.create (/path/to/file.ts:28:30)",
      "..."
    ],
    "timestamp": "2026-01-10T16:00:00.000Z",
    "path": "/api/users"
  }
}
```

## 🔧 Características

### ✅ Logging Estructurado
```typescript
this.logger.error('Unhandled exception', {
  exception: 'TypeError',
  message: 'Cannot read property...',
  stack: '...',
  url: '/api/users',
  method: 'POST',
  ip: '127.0.0.1',
  userAgent: 'Mozilla/5.0...'
});
```

### ✅ Modo Desarrollo vs Producción
- **Desarrollo**: Muestra stack trace y detalles
- **Producción**: Oculta información sensible

### ✅ Formato Consistente
Todas las respuestas de error siguen el mismo formato:
```json
{
  "success": false,
  "message": "Mensaje legible para el usuario",
  "error": {
    "code": "CODIGO_ERROR",
    "type": "TipoExcepcion",
    "status": 400,
    "timestamp": "ISO8601",
    "path": "/api/endpoint"
  }
}
```

## 🎉 Resultado

El manejo de excepciones en NestJS es ahora **100% equivalente** a Laravel:
- ✅ Mismo formato de respuestas
- ✅ Mismos códigos de error
- ✅ Mismo logging estructurado
- ✅ Misma separación de desarrollo/producción
- ✅ Misma experiencia para el frontend
