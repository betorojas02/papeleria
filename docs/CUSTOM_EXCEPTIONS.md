# Custom Exceptions - Uso como Laravel

## ✅ Excepciones Disponibles

### 1. ForbiddenException (403)

**Laravel**:
```php
throw UnauthorizedException::differentCompany('usuario');
throw UnauthorizedException::insufficientPermissions('eliminar', 'usuario');
throw UnauthorizedException::cannotModifySelf('eliminar');
throw UnauthorizedException::resourceLocked('usuario', 'en proceso de auditoría');
```

**NestJS** (Ahora idéntico):
```typescript
throw ForbiddenException.differentCompany('usuario');
throw ForbiddenException.insufficientPermissions('eliminar', 'usuario');
throw ForbiddenException.cannotModifySelf('eliminar');
throw ForbiddenException.resourceLocked('usuario', 'en proceso de auditoría');
throw ForbiddenException.roleNotAllowed('admin');
```

### 2. UnauthorizedException (401)

```typescript
throw UnauthorizedException.invalidCredentials();
throw UnauthorizedException.tokenExpired();
throw UnauthorizedException.invalidToken();
```

### 3. ResourceNotFoundException (404)

```typescript
throw new ResourceNotFoundException('User', userId);
throw new ResourceNotFoundException('Product');
```

### 4. ConflictException (409)

```typescript
throw ConflictException.duplicateResource('User', 'email', 'juan@example.com');
```

### 5. BusinessLogicException (400)

```typescript
throw new BusinessLogicException('Stock insuficiente', {
  available: 5,
  requested: 10
});
```

## 📝 Ejemplos en Servicios

```typescript
// UsersService
async delete(id: string, currentUserId: string) {
  const user = await this.findOne(id);
  
  // No puede eliminarse a sí mismo
  if (user.id === currentUserId) {
    throw ForbiddenException.cannotModifySelf('eliminar');
  }
  
  // Verificar permisos
  if (user.role === 'admin') {
    throw ForbiddenException.insufficientPermissions('eliminar', 'administrador');
  }
  
  await this.usersRepository.softDelete(id);
}

// ProductsService
async update(id: string, dto: UpdateProductDto, companyId: string) {
  const product = await this.findOne(id);
  
  // Verificar que pertenece a la misma compañía
  if (product.companyId !== companyId) {
    throw ForbiddenException.differentCompany('producto');
  }
  
  // Verificar si está bloqueado
  if (product.isLocked) {
    throw ForbiddenException.resourceLocked('producto', 'en inventario');
  }
  
  return this.productsRepository.save({ ...product, ...dto });
}
```

## 🎯 Respuestas Generadas

### ForbiddenException.differentCompany('usuario')
```json
{
  "success": false,
  "message": "No tiene autorización para acceder a este usuario.",
  "error": {
    "code": "FORBIDDEN",
    "type": "ForbiddenException",
    "status": 403,
    "reason": "different_company",
    "details": {
      "message": "El usuario pertenece a una compañía diferente a la suya."
    },
    "timestamp": "2026-01-10T16:00:00.000Z",
    "path": "/api/users/123"
  }
}
```

### ForbiddenException.cannotModifySelf('eliminar')
```json
{
  "success": false,
  "message": "No puede eliminar su propio usuario.",
  "error": {
    "code": "FORBIDDEN",
    "type": "ForbiddenException",
    "status": 403,
    "reason": "self_modification_not_allowed",
    "action": "eliminar",
    "timestamp": "2026-01-10T16:00:00.000Z",
    "path": "/api/users/123"
  }
}
```

## ✨ Ventajas

- ✅ Mensajes descriptivos en español
- ✅ Metadata estructurada
- ✅ Helpers para casos comunes
- ✅ Sintaxis idéntica a Laravel
- ✅ Type-safe con TypeScript
