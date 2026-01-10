# Papelería API - NestJS

Sistema de gestión para papelería construido con NestJS, TypeORM y PostgreSQL.

## 🚀 Características

- ✅ **Arquitectura Enterprise** - Migrada desde Laravel con mejores prácticas
- ✅ **TypeScript** - Tipado fuerte en todo el proyecto
- ✅ **TypeORM** - ORM robusto con migraciones
- ✅ **JWT Authentication** - Autenticación segura
- ✅ **Swagger/OpenAPI** - Documentación automática
- ✅ **Validación automática** - class-validator
- ✅ **Response Interceptor** - Respuestas estandarizadas
- ✅ **Exception Filters** - Manejo global de errores
- ✅ **Role-based Access** - Control de acceso por roles

## 📦 Módulos

### Core
- **Auth** - Login, registro, JWT
- **Users** - Gestión de usuarios con roles
- **Products** - Catálogo de productos con inventario
- **Categories** - Categorías de productos
- **Suppliers** - Proveedores
- **Sales** - Transacciones de venta

### Arquitectura (Migrada de Laravel)
- **ApiResponse** → `TransformInterceptor`
- **Form Requests** → DTOs con `class-validator`
- **API Resources** → DTOs con `class-transformer`
- **Exceptions** → Exception Filters
- **Middleware** → Guards & Interceptors

## 🛠️ Instalación

### Requisitos
- Node.js 18+
- PostgreSQL 15+
- npm o yarn

### Setup

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de base de datos

# 3. Crear base de datos
createdb papeleria

# 4. Ejecutar migraciones (cuando estén creadas)
npm run migration:run

# 5. Ejecutar seeders (cuando estén creados)
npm run seed

# 6. Iniciar servidor
npm run start:dev
```

## 🌐 Endpoints

### Base URL
```
http://localhost:3000/api
```

### Documentación Swagger
```
http://localhost:3000/api/docs
```

### Autenticación
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/refresh
```

### Usuarios
```
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

### Productos
```
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
GET    /api/products/low-stock
```

### Ventas
```
GET    /api/sales
GET    /api/sales/:id
POST   /api/sales
```

## 📁 Estructura del Proyecto

```
src/
├── common/                    # Utilidades compartidas
│   ├── decorators/           # @CurrentUser, @Roles
│   ├── filters/              # Exception filters
│   ├── guards/               # Auth & Role guards
│   ├── interceptors/         # Response interceptor
│   ├── pipes/                # Validation pipes
│   └── exceptions/           # Custom exceptions
├── config/                    # Configuración
│   ├── database.config.ts
│   └── jwt.config.ts
├── database/                  # Base de datos
│   ├── entities/             # Entidades TypeORM
│   ├── migrations/           # Migraciones
│   └── seeders/              # Seeders
├── modules/                   # Módulos de negocio
│   ├── auth/
│   ├── users/
│   ├── products/
│   ├── categories/
│   ├── suppliers/
│   └── sales/
├── app.module.ts
└── main.ts
```

## 🗄️ Entidades

### User
- id, firstName, lastName, email, password
- role: admin | employee | cashier
- Relaciones: sales

### Product
- id, name, description, price, cost, stock
- minStock, barcode, sku
- Relaciones: category, supplier, saleItems

### Category
- id, name, description
- Relaciones: products

### Supplier
- id, name, contact, phone, email, address
- Relaciones: products

### Sale
- id, total, discount, paymentMethod, status
- Relaciones: user, items

### SaleItem
- id, quantity, unitPrice, subtotal
- Relaciones: sale, product

## 🔐 Autenticación

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@papeleria.com",
    "password": "password123"
  }'
```

### Usar Token
```bash
curl -X GET http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📝 Ejemplos de Uso

### Crear Producto
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cuaderno Norma 100 hojas",
    "description": "Cuaderno tamaño carta",
    "price": 5000,
    "cost": 3000,
    "stock": 50,
    "minStock": 10,
    "categoryId": "uuid-here",
    "supplierId": "uuid-here"
  }'
```

### Crear Venta
```bash
curl -X POST http://localhost:3000/api/sales \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "uuid-here",
        "quantity": 2,
        "unitPrice": 5000
      }
    ],
    "paymentMethod": "cash",
    "discount": 0
  }'
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📊 Scripts Disponibles

```bash
npm run start          # Iniciar en modo producción
npm run start:dev      # Iniciar en modo desarrollo
npm run start:debug    # Iniciar en modo debug
npm run build          # Compilar proyecto
npm run lint           # Ejecutar linter
npm run format         # Formatear código
```

## 🔧 Configuración

### Variables de Entorno

```env
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=papeleria

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Swagger
SWAGGER_ENABLED=true
```

## 🚢 Deployment

### Docker (Próximamente)
```bash
docker-compose up -d
```

### Manual
```bash
npm run build
npm run start:prod
```

## 📚 Documentación Adicional

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Swagger/OpenAPI](https://swagger.io)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado.

## 👨‍💻 Autor

Desarrollado con ❤️ usando NestJS

---

## 🎯 Próximos Pasos

- [ ] Implementar módulo de Auth completo
- [ ] Crear migraciones de base de datos
- [ ] Implementar seeders
- [ ] Agregar tests unitarios
- [ ] Agregar tests E2E
- [ ] Configurar Docker
- [ ] Implementar CI/CD
