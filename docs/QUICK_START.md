# Guía de Inicio Rápido - Papelería API

## ✅ Estado Actual

El proyecto está **completamente configurado** y listo para usar:
- ✅ Código compilado sin errores
- ✅ Módulos Auth y Users creados
- ✅ Swagger configurado
- ⚠️ **Falta**: Crear base de datos PostgreSQL

## 🚀 Opciones para Iniciar

### Opción 1: PostgreSQL (Recomendado para producción)

**Crear base de datos**:
```bash
# Opción A: Con psql
psql -h localhost -p 5433 -U postgres -c "CREATE DATABASE papeleria;"

# Opción B: Con pgAdmin (interfaz gráfica)
# 1. Abrir pgAdmin
# 2. Conectar a localhost:5433
# 3. Click derecho en "Databases" → Create → Database
# 4. Nombre: papeleria
```

**Iniciar servidor**:
```bash
npm run start:dev
```

### Opción 2: SQLite (Más fácil para desarrollo)

**Cambiar en `.env`**:
```env
DB_TYPE=sqlite
DB_DATABASE=papeleria.sqlite
```

**Iniciar servidor**:
```bash
npm run start:dev
```

## 📚 Acceder a Swagger

Una vez iniciado el servidor:

**URL**: http://localhost:3000/api/docs

### ¿Qué es Swagger?

Swagger es una **interfaz web interactiva** que:
- ✅ Muestra TODOS tus endpoints automáticamente
- ✅ Permite probar cada endpoint desde el navegador
- ✅ Genera documentación automática
- ✅ Muestra ejemplos de request/response
- ✅ **Reemplaza Postman** para testing básico

### Cómo usar Swagger

1. **Abrir** http://localhost:3000/api/docs
2. **Ver endpoints** organizados por tags (auth, users)
3. **Click en "Try it out"** en cualquier endpoint
4. **Llenar datos** y click en "Execute"
5. **Ver respuesta** directamente

## 🔐 Primeros Pasos

### 1. Registrar primer usuario
```
POST /api/auth/register
```
Body:
```json
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@papeleria.com",
  "password": "password123",
  "role": "admin"
}
```

### 2. Login
```
POST /api/auth/login
```
Body:
```json
{
  "email": "admin@papeleria.com",
  "password": "password123"
}
```

**Copiar** el `access_token` de la respuesta.

### 3. Autorizar en Swagger

1. Click en botón **"Authorize"** (candado) arriba a la derecha
2. Pegar: `Bearer <tu_access_token>`
3. Click "Authorize"
4. Ahora puedes usar todos los endpoints protegidos

## 📊 Endpoints Disponibles

### Auth
- POST `/api/auth/register` - Registrar usuario
- POST `/api/auth/login` - Login
- POST `/api/auth/refresh` - Refresh token
- GET `/api/auth/profile` - Ver perfil
- POST `/api/auth/logout` - Logout

### Users
- POST `/api/users` - Crear usuario (ADMIN)
- GET `/api/users` - Listar usuarios
- GET `/api/users/:id` - Ver usuario
- PATCH `/api/users/:id` - Actualizar usuario (ADMIN)
- DELETE `/api/users/:id` - Eliminar usuario (ADMIN)

## 🎯 Próximos Pasos

1. Crear base de datos
2. Iniciar servidor
3. Abrir Swagger
4. Registrar primer usuario admin
5. Empezar a crear usuarios y trabajar

## ⚙️ Variables de Entorno

Tu `.env` actual:
```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=
DB_DATABASE=papeleria

JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

SWAGGER_ENABLED=true
```
