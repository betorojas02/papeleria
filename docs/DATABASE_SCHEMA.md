# 🗄️ Modelo Entidad-Relación (MER) - Papelería API

## 📊 Herramientas Recomendadas para Visualizar el MER

### 🥇 **Opción 1: DBeaver (RECOMENDADA)**
- **Gratis y Open Source**
- **Genera diagramas ER automáticamente**
- **Muestra tipos de datos, longitudes, índices, llaves**
- **Descarga**: https://dbeaver.io/download/

**Cómo usarlo**:
1. Instalar DBeaver
2. Conectar a tu base de datos PostgreSQL
3. Click derecho en tu base de datos → `ER Diagram`
4. Exportar como imagen PNG/SVG

---

### 🥈 **Opción 2: pgAdmin 4**
- **Cliente oficial de PostgreSQL**
- **Incluido con PostgreSQL**
- **Genera diagramas ER**
- **Ya lo tienes instalado si instalaste PostgreSQL**

**Cómo usarlo**:
1. Abrir pgAdmin
2. Conectar a tu servidor
3. Tools → ERD Tool
4. Seleccionar tablas

---

### 🥉 **Opción 3: DataGrip (JetBrains)**
- **De pago** (pero tiene trial de 30 días)
- **Muy potente**
- **Genera diagramas automáticamente**
- **Descarga**: https://www.jetbrains.com/datagrip/

---

### 🔧 **Opción 4: TypeORM Schema Sync (Actual)**
Puedes generar un script SQL con el schema actual:

```bash
# En tu proyecto
npm run typeorm schema:log
```

---

## 📋 Esquema Completo de Base de Datos

### **Tabla: users**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'employee',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

-- Índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);
```

**Campos**:
- `id`: UUID (Primary Key)
- `first_name`: VARCHAR(255) - Nombre
- `last_name`: VARCHAR(255) - Apellido
- `email`: VARCHAR(255) UNIQUE - Email único
- `password`: VARCHAR(255) - Contraseña hasheada
- `role`: VARCHAR(50) - Rol (admin, employee, cashier)
- `is_active`: BOOLEAN - Estado activo
- `created_at`: TIMESTAMP - Fecha creación
- `updated_at`: TIMESTAMP - Fecha actualización
- `deleted_at`: TIMESTAMP NULL - Soft delete

---

### **Tabla: categories**
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

-- Índices
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_deleted_at ON categories(deleted_at);
```

**Campos**:
- `id`: UUID (PK)
- `name`: VARCHAR(255) UNIQUE - Nombre único
- `description`: TEXT - Descripción
- `is_active`: BOOLEAN - Activo
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP
- `deleted_at`: TIMESTAMP NULL

---

### **Tabla: brands**
```sql
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

-- Índices
CREATE INDEX idx_brands_name ON brands(name);
CREATE INDEX idx_brands_deleted_at ON brands(deleted_at);
```

**Campos**: Igual que categories

---

### **Tabla: suppliers**
```sql
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) NULL,
    phone VARCHAR(50) NULL,
    address TEXT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

-- Índices
CREATE INDEX idx_suppliers_tax_id ON suppliers(tax_id);
CREATE INDEX idx_suppliers_deleted_at ON suppliers(deleted_at);
```

**Campos**:
- `id`: UUID (PK)
- `name`: VARCHAR(255) - Nombre
- `tax_id`: VARCHAR(50) UNIQUE - NIT único
- `email`: VARCHAR(255) - Email
- `phone`: VARCHAR(50) - Teléfono
- `address`: TEXT - Dirección
- `is_active`: BOOLEAN
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP
- `deleted_at`: TIMESTAMP NULL

---

### **Tabla: customers**
```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NULL,
    phone VARCHAR(50) NULL,
    address TEXT NULL,
    document_number VARCHAR(50) NULL,
    document_type VARCHAR(20) NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

-- Índices
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_deleted_at ON customers(deleted_at);
```

**Campos**:
- `id`: UUID (PK)
- `first_name`: VARCHAR(255) - Nombre
- `last_name`: VARCHAR(255) - Apellido
- `email`: VARCHAR(255) UNIQUE - Email único
- `phone`: VARCHAR(50) - Teléfono
- `address`: TEXT - Dirección
- `document_number`: VARCHAR(50) - Número documento
- `document_type`: VARCHAR(20) - Tipo (CC, CE, NIT, PASSPORT)
- `is_active`: BOOLEAN
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP
- `deleted_at`: TIMESTAMP NULL

---

### **Tabla: products**
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2) NULL,
    stock INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 10,
    barcode VARCHAR(255) UNIQUE NULL,
    sku VARCHAR(255) UNIQUE NULL,
    type VARCHAR(20) DEFAULT 'physical',
    is_active BOOLEAN DEFAULT true,
    category_id UUID NOT NULL,
    brand_id UUID NULL,
    supplier_id UUID NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) 
        REFERENCES categories(id),
    CONSTRAINT fk_products_brand FOREIGN KEY (brand_id) 
        REFERENCES brands(id),
    CONSTRAINT fk_products_supplier FOREIGN KEY (supplier_id) 
        REFERENCES suppliers(id)
);

-- Índices
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_brand_id ON products(brand_id);
CREATE INDEX idx_products_stock ON products(stock);
CREATE INDEX idx_products_deleted_at ON products(deleted_at);
```

**Campos**:
- `id`: UUID (PK)
- `name`: VARCHAR(255) - Nombre
- `description`: TEXT - Descripción
- `price`: DECIMAL(10,2) - Precio venta
- `cost`: DECIMAL(10,2) - Costo
- `stock`: INTEGER - Stock actual
- `min_stock`: INTEGER - Stock mínimo
- `barcode`: VARCHAR(255) UNIQUE - Código barras único
- `sku`: VARCHAR(255) UNIQUE - SKU único
- `type`: VARCHAR(20) - Tipo (physical/service)
- `is_active`: BOOLEAN
- `category_id`: UUID (FK → categories)
- `brand_id`: UUID (FK → brands) NULLABLE
- `supplier_id`: UUID (FK → suppliers) NULLABLE
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP
- `deleted_at`: TIMESTAMP NULL

---

### **Tabla: cash_registers**
```sql
CREATE TABLE cash_registers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opening_amount DECIMAL(10,2) NOT NULL,
    closing_amount DECIMAL(10,2) NULL,
    status VARCHAR(20) DEFAULT 'open',
    opened_at TIMESTAMP DEFAULT NOW(),
    closed_at TIMESTAMP NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    
    CONSTRAINT fk_cash_registers_user FOREIGN KEY (user_id) 
        REFERENCES users(id)
);

-- Índices
CREATE INDEX idx_cash_registers_user_id ON cash_registers(user_id);
CREATE INDEX idx_cash_registers_status ON cash_registers(status);
CREATE INDEX idx_cash_registers_deleted_at ON cash_registers(deleted_at);
```

**Campos**:
- `id`: UUID (PK)
- `opening_amount`: DECIMAL(10,2) - Monto apertura
- `closing_amount`: DECIMAL(10,2) - Monto cierre
- `status`: VARCHAR(20) - Estado (open/closed)
- `opened_at`: TIMESTAMP - Fecha apertura
- `closed_at`: TIMESTAMP - Fecha cierre
- `user_id`: UUID (FK → users)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP
- `deleted_at`: TIMESTAMP NULL

---

### **Tabla: purchases**
```sql
CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    total DECIMAL(10,2) NOT NULL,
    invoice_number VARCHAR(255) NULL,
    purchase_date TIMESTAMP DEFAULT NOW(),
    supplier_id UUID NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    
    CONSTRAINT fk_purchases_supplier FOREIGN KEY (supplier_id) 
        REFERENCES suppliers(id),
    CONSTRAINT fk_purchases_user FOREIGN KEY (user_id) 
        REFERENCES users(id)
);

-- Índices
CREATE INDEX idx_purchases_supplier_id ON purchases(supplier_id);
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_purchase_date ON purchases(purchase_date);
CREATE INDEX idx_purchases_deleted_at ON purchases(deleted_at);
```

**Campos**:
- `id`: UUID (PK)
- `total`: DECIMAL(10,2) - Total compra
- `invoice_number`: VARCHAR(255) - Número factura
- `purchase_date`: TIMESTAMP - Fecha compra
- `supplier_id`: UUID (FK → suppliers)
- `user_id`: UUID (FK → users)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP
- `deleted_at`: TIMESTAMP NULL

---

### **Tabla: purchase_details**
```sql
CREATE TABLE purchase_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    purchase_id UUID NOT NULL,
    product_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    
    CONSTRAINT fk_purchase_details_purchase FOREIGN KEY (purchase_id) 
        REFERENCES purchases(id) ON DELETE CASCADE,
    CONSTRAINT fk_purchase_details_product FOREIGN KEY (product_id) 
        REFERENCES products(id)
);

-- Índices
CREATE INDEX idx_purchase_details_purchase_id ON purchase_details(purchase_id);
CREATE INDEX idx_purchase_details_product_id ON purchase_details(product_id);
CREATE INDEX idx_purchase_details_deleted_at ON purchase_details(deleted_at);
```

**Campos**:
- `id`: UUID (PK)
- `quantity`: INTEGER - Cantidad
- `unit_cost`: DECIMAL(10,2) - Costo unitario
- `subtotal`: DECIMAL(10,2) - Subtotal
- `purchase_id`: UUID (FK → purchases) CASCADE
- `product_id`: UUID (FK → products)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP
- `deleted_at`: TIMESTAMP NULL

---

### **Tabla: sales**
```sql
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    total DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'completed',
    notes TEXT NULL,
    invoice_number VARCHAR(255) NULL,
    user_id UUID NOT NULL,
    customer_id UUID NULL,
    cash_register_id UUID NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    
    CONSTRAINT fk_sales_user FOREIGN KEY (user_id) 
        REFERENCES users(id),
    CONSTRAINT fk_sales_customer FOREIGN KEY (customer_id) 
        REFERENCES customers(id),
    CONSTRAINT fk_sales_cash_register FOREIGN KEY (cash_register_id) 
        REFERENCES cash_registers(id)
);

-- Índices
CREATE INDEX idx_sales_user_id ON sales(user_id);
CREATE INDEX idx_sales_customer_id ON sales(customer_id);
CREATE INDEX idx_sales_cash_register_id ON sales(cash_register_id);
CREATE INDEX idx_sales_created_at ON sales(created_at);
CREATE INDEX idx_sales_deleted_at ON sales(deleted_at);
```

**Campos**:
- `id`: UUID (PK)
- `total`: DECIMAL(10,2) - Total venta
- `discount`: DECIMAL(10,2) - Descuento
- `tax_amount`: DECIMAL(10,2) - Impuesto
- `status`: VARCHAR(20) - Estado (pending/completed/cancelled)
- `notes`: TEXT - Notas
- `invoice_number`: VARCHAR(255) - Número factura
- `user_id`: UUID (FK → users)
- `customer_id`: UUID (FK → customers) NULLABLE
- `cash_register_id`: UUID (FK → cash_registers) NULLABLE
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP
- `deleted_at`: TIMESTAMP NULL

---

### **Tabla: sale_items**
```sql
CREATE TABLE sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    sale_id UUID NOT NULL,
    product_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    
    CONSTRAINT fk_sale_items_sale FOREIGN KEY (sale_id) 
        REFERENCES sales(id) ON DELETE CASCADE,
    CONSTRAINT fk_sale_items_product FOREIGN KEY (product_id) 
        REFERENCES products(id)
);

-- Índices
CREATE INDEX idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX idx_sale_items_product_id ON sale_items(product_id);
CREATE INDEX idx_sale_items_deleted_at ON sale_items(deleted_at);
```

**Campos**:
- `id`: UUID (PK)
- `quantity`: INTEGER - Cantidad
- `unit_price`: DECIMAL(10,2) - Precio unitario
- `subtotal`: DECIMAL(10,2) - Subtotal
- `sale_id`: UUID (FK → sales) CASCADE
- `product_id`: UUID (FK → products)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP
- `deleted_at`: TIMESTAMP NULL

---

### **Tabla: sale_payments**
```sql
CREATE TABLE sale_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_method VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    voucher_number VARCHAR(255) NULL,
    reference_number VARCHAR(255) NULL,
    notes TEXT NULL,
    sale_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    
    CONSTRAINT fk_sale_payments_sale FOREIGN KEY (sale_id) 
        REFERENCES sales(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX idx_sale_payments_sale_id ON sale_payments(sale_id);
CREATE INDEX idx_sale_payments_payment_method ON sale_payments(payment_method);
CREATE INDEX idx_sale_payments_deleted_at ON sale_payments(deleted_at);
```

**Campos**:
- `id`: UUID (PK)
- `payment_method`: VARCHAR(20) - Método (cash/card/transfer/nequi/daviplata)
- `amount`: DECIMAL(10,2) - Monto
- `voucher_number`: VARCHAR(255) - Número voucher
- `reference_number`: VARCHAR(255) - Número referencia
- `notes`: TEXT - Notas
- `sale_id`: UUID (FK → sales) CASCADE
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP
- `deleted_at`: TIMESTAMP NULL

---

## 🔗 Relaciones (Foreign Keys)

### **Products**
- `category_id` → `categories.id` (REQUIRED)
- `brand_id` → `brands.id` (OPTIONAL)
- `supplier_id` → `suppliers.id` (OPTIONAL)

### **Cash Registers**
- `user_id` → `users.id` (REQUIRED)

### **Purchases**
- `supplier_id` → `suppliers.id` (REQUIRED)
- `user_id` → `users.id` (REQUIRED)

### **Purchase Details**
- `purchase_id` → `purchases.id` (CASCADE DELETE)
- `product_id` → `products.id` (REQUIRED)

### **Sales**
- `user_id` → `users.id` (REQUIRED)
- `customer_id` → `customers.id` (OPTIONAL)
- `cash_register_id` → `cash_registers.id` (OPTIONAL)

### **Sale Items**
- `sale_id` → `sales.id` (CASCADE DELETE)
- `product_id` → `products.id` (REQUIRED)

### **Sale Payments**
- `sale_id` → `sales.id` (CASCADE DELETE)

---

## 📊 Resumen de Tablas

| Tabla | Registros Típicos | Relaciones |
|-------|------------------|------------|
| users | 10-100 | → cash_registers, purchases, sales |
| categories | 10-50 | ← products |
| brands | 20-100 | ← products |
| suppliers | 10-50 | ← products, purchases |
| customers | 100-10,000 | ← sales |
| products | 100-10,000 | → category, brand, supplier |
| cash_registers | 100-1,000 | → user, ← sales |
| purchases | 100-10,000 | → supplier, user, ← purchase_details |
| purchase_details | 500-50,000 | → purchase, product |
| sales | 1,000-100,000 | → user, customer, cash_register, ← sale_items, sale_payments |
| sale_items | 5,000-500,000 | → sale, product |
| sale_payments | 1,000-100,000 | → sale |

---

## 🛠️ Comandos Útiles

### **Ver schema actual en PostgreSQL**
```sql
-- Ver todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Ver columnas de una tabla
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'products';

-- Ver foreign keys
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';

-- Ver índices
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE schemaname = 'public';
```

---

## 🎯 Próximos Pasos

1. **Instalar DBeaver** y conectar a tu BD
2. **Generar diagrama ER** automático
3. **Exportar como imagen** para documentación
4. **Revisar índices** y optimizar si es necesario
5. **Agregar campos** según necesites

**DBeaver es la mejor opción** porque es gratis, potente y genera diagramas hermosos automáticamente.
