# ApiResponse Helper - Uso como Laravel

## 🎯 Problema

En Laravel usabas el trait `ApiResponse` así:

```php
class UserController extends Controller {
    use ApiResponse;
    
    public function store(Request $request) {
        $user = User::create($request->all());
        return $this->success($user, 'User created');
    }
}
```

## ✅ Solución en NestJS

### Opción 1: Helper Class (Más parecido a Laravel)

```typescript
import { ApiResponse } from '../../common/helpers/api-response.helper';

@Controller('users')
export class UsersController {
  
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return ApiResponse.success(user, 'User created successfully');
  }
  
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return ApiResponse.success(users, 'Users retrieved successfully');
  }
  
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return ApiResponse.deleted('User deleted successfully');
  }
}
```

### Opción 2: Retornar Directo (Más simple)

El `TransformInterceptor` ya está configurado globalmente, así que puedes retornar directo:

```typescript
@Controller('users')
export class UsersController {
  
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    // El interceptor automáticamente envuelve en { success, data, timestamp }
    return user;
  }
}
```

## 📊 Comparación

### Laravel
```php
// Trait
trait ApiResponse {
    protected function success($data, $message = 'Success') {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ]);
    }
}

// Uso
return $this->success($user, 'User created');
```

### NestJS - Opción 1 (Helper)
```typescript
// Helper
export class ApiResponse {
    static success(data, message = 'Success') {
        return { data, message };
    }
}

// Uso
return ApiResponse.success(user, 'User created');
```

### NestJS - Opción 2 (Interceptor)
```typescript
// Solo retornar
return user;

// El interceptor transforma a:
// { success: true, data: user, timestamp: '...' }
```

## 🔧 Métodos Disponibles

```typescript
// Success (200)
ApiResponse.success(data, 'Custom message')

// Created (201)
ApiResponse.created(data, 'Resource created')

// Updated (200)
ApiResponse.updated(data, 'Resource updated')

// Deleted (200)
ApiResponse.deleted('Resource deleted')

// Error (usado en exception filters)
ApiResponse.error('Error message', { field: 'error' })
```

## 💡 Recomendación

**Usa Opción 1 (Helper)** si:
- ✅ Quieres control explícito del mensaje
- ✅ Prefieres sintaxis similar a Laravel
- ✅ Quieres ser más descriptivo

**Usa Opción 2 (Interceptor)** si:
- ✅ Quieres código más limpio
- ✅ No necesitas mensajes personalizados
- ✅ Prefieres el estilo NestJS

## 🎯 Ejemplo Completo

```typescript
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiResponse } from '../../common/helpers/api-response.helper';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return ApiResponse.created(user, 'Usuario creado exitosamente');
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return ApiResponse.success(users, 'Usuarios obtenidos exitosamente');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return ApiResponse.success(user, 'Usuario encontrado');
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    return ApiResponse.updated(user, 'Usuario actualizado exitosamente');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return ApiResponse.deleted('Usuario eliminado exitosamente');
  }
}
```

## 🚀 Resultado

Ambas opciones producen la misma respuesta:

```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "id": "uuid",
    "firstName": "Juan",
    "email": "juan@example.com"
  },
  "timestamp": "2026-01-10T16:00:00.000Z"
}
```

La diferencia es solo en la sintaxis del controlador.
