# 🎉 Servidor NestJS Corriendo Exitosamente

## ✅ Estado Actual

```
🚀 Servidor: http://localhost:3000/api
📚 Swagger: http://localhost:3000/api/docs
✅ Base de datos: PostgreSQL conectada
✅ Tablas: Creadas automáticamente
```

## 👥 Usuarios de Prueba Creados

### 1. Admin
```
Email: admin@papeleria.com
Password: admin123
Role: admin
```

### 2. Empleado
```
Email: juan@papeleria.com
Password: juan123
Role: employee
```

### 3. Cajero
```
Email: maria@papeleria.com
Password: maria123
Role: cashier
```

## 🔐 Cómo Usar Swagger

### Paso 1: Abrir Swagger
Abre en tu navegador: **http://localhost:3000/api/docs**

### Paso 2: Login
1. Busca la sección **"auth"**
2. Click en **POST /api/auth/login**
3. Click en **"Try it out"**
4. Pega este JSON:
```json
{
  "email": "admin@papeleria.com",
  "password": "admin123"
}
```
5. Click en **"Execute"**
6. **Copia** el `access_token` de la respuesta

### Paso 3: Autorizar
1. Click en el botón **"Authorize"** (🔒) arriba a la derecha
2. Pega: `Bearer <tu_access_token>`
3. Click **"Authorize"**
4. Click **"Close"**

### Paso 4: Probar Endpoints
Ahora puedes probar cualquier endpoint:

#### Listar Usuarios
1. Busca **GET /api/users**
2. Click **"Try it out"**
3. Click **"Execute"**
4. Verás los 3 usuarios creados

#### Crear Usuario
1. Busca **POST /api/users**
2. Click **"Try it out"**
3. Modifica el JSON:
```json
{
  "firstName": "Pedro",
  "lastName": "Vendedor",
  "email": "pedro@papeleria.com",
  "password": "pedro123",
  "role": "employee",
  "isActive": true
}
```
4. Click **"Execute"**

## 📊 Endpoints Disponibles

### Auth (No requieren autenticación)
- ✅ `POST /api/auth/register` - Registrar usuario
- ✅ `POST /api/auth/login` - Login

### Auth (Requieren autenticación)
- ✅ `POST /api/auth/refresh` - Refresh token
- ✅ `GET /api/auth/profile` - Ver perfil
- ✅ `POST /api/auth/logout` - Logout

### Users (Requieren autenticación)
- ✅ `GET /api/users` - Listar (ADMIN, EMPLOYEE)
- ✅ `GET /api/users/:id` - Ver uno (ADMIN, EMPLOYEE)
- ✅ `POST /api/users` - Crear (ADMIN)
- ✅ `PATCH /api/users/:id` - Actualizar (ADMIN)
- ✅ `DELETE /api/users/:id` - Eliminar (ADMIN)

## 🎯 Próximos Pasos

Ahora que tienes usuarios, puedes:

1. **Explorar Swagger** - Probar todos los endpoints
2. **Crear más usuarios** - Con diferentes roles
3. **Continuar con módulos** - Categories, Products, etc.

## 💡 Tips de Swagger

### Ver Esquemas
- Scroll hasta abajo en Swagger
- Sección **"Schemas"** muestra todos los DTOs
- Puedes ver la estructura de cada request/response

### Códigos de Respuesta
Cada endpoint muestra:
- ✅ **200/201** - Éxito
- ⚠️ **400** - Validación fallida
- 🔒 **401** - No autenticado
- 🚫 **403** - Sin permisos
- ❌ **404** - No encontrado
- ⚠️ **409** - Conflicto (ej: email duplicado)

### Probar Errores
Intenta:
- Crear usuario con email duplicado → 409
- Acceder sin token → 401
- Crear usuario siendo employee → 403

## 🔄 Refresh Token

Cuando el access_token expire (1 día):

1. Usa **POST /api/auth/refresh**
2. Envía el `refresh_token`
3. Obtendrás un nuevo `access_token`

## 📝 Ejemplo Completo en cURL

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@papeleria.com","password":"admin123"}' \
  | jq -r '.data.access_token')

# 2. Listar usuarios
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer $TOKEN"

# 3. Crear usuario
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@papeleria.com",
    "password": "test123",
    "role": "employee"
  }'
```

## 🎉 ¡Listo para Trabajar!

Tu API está completamente funcional. Abre Swagger y empieza a explorar:

**http://localhost:3000/api/docs**
