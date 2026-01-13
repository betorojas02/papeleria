# 📚 Guía Completa de Tablas y Relaciones - Sistema Papelería

## 📖 Índice
1. [Tablas Maestras](#tablas-maestras)
2. [Tablas de Operaciones](#tablas-de-operaciones)
3. [Tablas de Detalles](#tablas-de-detalles)
4. [Diagrama de Relaciones](#diagrama-de-relaciones)

---

## 🎯 Tablas Maestras

### 1. **users** - Usuarios del Sistema
**Propósito**: Almacenar los usuarios que pueden acceder al sistema (administradores, empleados, cajeros).

**Campos Principales**:
- `first_name`, `last_name` - Nombre completo
- `email` - Email único para login
- `password` - Contraseña encriptada
- `role` - Rol: `admin`, `employee`, `cashier`

**Relaciones**:
- ➡️ **Crea** `cash_registers` (un usuario puede abrir/cerrar cajas)
- ➡️ **Registra** `purchases` (un usuario registra compras)
- ➡️ **Realiza** `sales` (un usuario realiza ventas)

**Ejemplo de Uso**:
```
Usuario "Juan Pérez" (admin)
  ├─ Abre caja registradora #1
  ├─ Registra compra #45
  └─ Realiza venta #123
```

---

### 2. **categories** - Categorías de Productos
**Propósito**: Clasificar productos por tipo (Cuadernos, Lápices, Borradores, etc.).

**Campos Principales**:
- `name` - Nombre único (ej: "Cuadernos")
- `description` - Descripción de la categoría

**Relaciones**:
- ⬅️ **Tiene muchos** `products` (una categoría agrupa muchos productos)

**Ejemplo de Uso**:
```
Categoría "Cuadernos"
  ├─ Producto: Cuaderno Norma 100 hojas
  ├─ Producto: Cuaderno Scribe 80 hojas
  └─ Producto: Cuaderno universitario
```

**⚠️ Importante**: Un producto DEBE tener una categoría (obligatorio).

---

### 3. **brands** - Marcas
**Propósito**: Almacenar las marcas de los productos (Norma, Bic, Faber-Castell, etc.).

**Campos Principales**:
- `name` - Nombre único (ej: "Norma")
- `description` - Descripción de la marca

**Relaciones**:
- ⬅️ **Tiene muchos** `products` (una marca puede tener muchos productos)

**Ejemplo de Uso**:
```
Marca "Norma"
  ├─ Producto: Cuaderno Norma 100 hojas
  ├─ Producto: Carpeta Norma tamaño carta
  └─ Producto: Block Norma 50 hojas
```

**⚠️ Importante**: Un producto PUEDE tener marca (opcional).

---

### 4. **suppliers** - Proveedores
**Propósito**: Almacenar información de proveedores que surten productos.

**Campos Principales**:
- `name` - Nombre del proveedor
- `tax_id` - NIT único del proveedor
- `email`, `phone`, `address` - Datos de contacto

**Relaciones**:
- ⬅️ **Surte** `products` (un proveedor puede surtir productos)
- ⬅️ **Recibe** `purchases` (las compras se hacen a proveedores)

**Ejemplo de Uso**:
```
Proveedor "Distribuidora Escolar XYZ"
  ├─ Surte: Cuadernos Norma
  ├─ Surte: Lápices Bic
  └─ Compra #45: 100 cuadernos a $3,000 c/u
```

---

### 5. **customers** - Clientes
**Propósito**: Almacenar información de clientes que compran en la papelería.

**Campos Principales**:
- `first_name`, `last_name` - Nombre completo
- `email` - Email único (opcional)
- `document_number`, `document_type` - Documento de identidad

**Relaciones**:
- ⬅️ **Realiza** `sales` (un cliente puede hacer muchas compras)

**Ejemplo de Uso**:
```
Cliente "María García"
  ├─ Venta #123: 2 cuadernos + 3 lápices
  ├─ Venta #156: 1 resma de papel
  └─ Venta #189: 5 borradores
```

**⚠️ Importante**: Una venta PUEDE tener cliente (opcional, para ventas al público general).

---

## 🏪 Tablas de Operaciones

### 6. **products** - Productos (TABLA CENTRAL)
**Propósito**: Almacenar todos los productos disponibles en la papelería con su inventario.

**Campos Principales**:
- `name` - Nombre del producto
- `price` - Precio de venta
- `cost` - Costo de compra
- `stock` - Cantidad disponible en inventario
- `min_stock` - Stock mínimo para alertas
- `barcode` - Código de barras único
- `sku` - Código interno único
- `type` - Tipo: `physical` (con inventario) o `service` (sin inventario)

**Relaciones**:
- ➡️ **Pertenece a** `categories` (obligatorio)
- ➡️ **Es de marca** `brands` (opcional)
- ➡️ **Surtido por** `suppliers` (opcional)
- ⬅️ **Aparece en** `purchase_details` (detalles de compras)
- ⬅️ **Aparece en** `sale_items` (items de ventas)

**Ejemplo de Uso**:
```
Producto "Cuaderno Norma 100 hojas"
  ├─ Categoría: Cuadernos
  ├─ Marca: Norma
  ├─ Proveedor: Distribuidora XYZ
  ├─ Precio: $5,000
  ├─ Stock: 50 unidades
  ├─ Barcode: 7701234567890
  ├─ SKU: CUAD-NORMA-100
  │
  ├─ Comprado en:
  │   └─ Compra #45: +100 unidades a $3,000 c/u
  │
  └─ Vendido en:
      ├─ Venta #123: -2 unidades a $5,000 c/u
      └─ Venta #156: -3 unidades a $5,000 c/u
```

**🔄 Actualización Automática de Stock**:
- ✅ **Compra** → Stock aumenta automáticamente
- ✅ **Venta** → Stock disminuye automáticamente

---

### 7. **cash_registers** - Cajas Registradoras
**Propósito**: Controlar turnos de caja (apertura y cierre).

**Campos Principales**:
- `opening_amount` - Monto inicial al abrir
- `closing_amount` - Monto final al cerrar
- `status` - Estado: `open` o `closed`
- `opened_at` - Fecha/hora de apertura
- `closed_at` - Fecha/hora de cierre

**Relaciones**:
- ➡️ **Abierta por** `users` (un usuario abre la caja)
- ⬅️ **Registra** `sales` (las ventas se asocian a una caja)

**Ejemplo de Uso**:
```
Caja #1 - Turno Mañana
  ├─ Abierta por: Juan Pérez (cajero)
  ├─ Monto inicial: $50,000
  ├─ Ventas del turno:
  │   ├─ Venta #123: $10,000
  │   ├─ Venta #124: $15,000
  │   └─ Venta #125: $8,000
  └─ Monto cierre: $83,000
```

**⚠️ Validaciones**:
- ✅ Un usuario NO puede abrir 2 cajas al mismo tiempo
- ✅ NO se puede eliminar una caja abierta

---

### 8. **purchases** - Compras a Proveedores
**Propósito**: Registrar compras de productos a proveedores.

**Campos Principales**:
- `total` - Total de la compra
- `invoice_number` - Número de factura del proveedor
- `purchase_date` - Fecha de compra

**Relaciones**:
- ➡️ **Compra a** `suppliers` (proveedor que surte)
- ➡️ **Registrada por** `users` (usuario que registra)
- ⬅️ **Contiene** `purchase_details` (productos comprados)

**Ejemplo de Uso**:
```
Compra #45
  ├─ Proveedor: Distribuidora XYZ
  ├─ Registrada por: Juan Pérez
  ├─ Fecha: 2026-01-10
  ├─ Factura: FAC-001
  │
  ├─ Detalles:
  │   ├─ 100 Cuadernos Norma a $3,000 = $300,000
  │   ├─ 50 Lápices Bic a $500 = $25,000
  │   └─ 200 Borradores a $300 = $60,000
  │
  └─ Total: $385,000
```

**🔄 Efecto en Inventario**:
```
Antes de la compra:
  Cuadernos: 20 unidades

Después de la compra:
  Cuadernos: 120 unidades (+100)
```

---

### 9. **sales** - Ventas a Clientes
**Propósito**: Registrar ventas realizadas a clientes.

**Campos Principales**:
- `total` - Total de la venta
- `discount` - Descuento aplicado
- `tax_amount` - Impuestos
- `status` - Estado: `pending`, `completed`, `cancelled`
- `invoice_number` - Número de factura

**Relaciones**:
- ➡️ **Vendida por** `users` (usuario que vende)
- ➡️ **Vendida a** `customers` (cliente, opcional)
- ➡️ **En caja** `cash_registers` (caja donde se registra)
- ⬅️ **Contiene** `sale_items` (productos vendidos)
- ⬅️ **Pagada con** `sale_payments` (formas de pago)

**Ejemplo de Uso**:
```
Venta #123
  ├─ Cliente: María García
  ├─ Vendida por: Ana López (cajera)
  ├─ Caja: #1
  ├─ Fecha: 2026-01-10 10:30 AM
  │
  ├─ Items:
  │   ├─ 2 Cuadernos Norma a $5,000 = $10,000
  │   ├─ 3 Lápices Bic a $1,000 = $3,000
  │   └─ 1 Borrador a $500 = $500
  │
  ├─ Subtotal: $13,500
  ├─ Descuento: $0
  ├─ Impuesto: $0
  ├─ Total: $13,500
  │
  └─ Pagos:
      ├─ Efectivo: $10,000
      └─ Tarjeta: $3,500
```

**🔄 Efecto en Inventario**:
```
Antes de la venta:
  Cuadernos: 50 unidades

Después de la venta:
  Cuadernos: 48 unidades (-2)
```

**⚠️ Validaciones**:
- ✅ Debe haber stock suficiente
- ✅ Los pagos deben cubrir el total

---

## 📋 Tablas de Detalles

### 10. **purchase_details** - Detalles de Compras
**Propósito**: Almacenar cada producto comprado en una compra.

**Campos Principales**:
- `quantity` - Cantidad comprada
- `unit_cost` - Costo unitario
- `subtotal` - Cantidad × Costo

**Relaciones**:
- ➡️ **Pertenece a** `purchases` (compra padre)
- ➡️ **Es del producto** `products` (producto comprado)

**Ejemplo**:
```
Compra #45
  └─ Detalle #1:
      ├─ Producto: Cuaderno Norma
      ├─ Cantidad: 100
      ├─ Costo unitario: $3,000
      └─ Subtotal: $300,000
```

**⚠️ Importante**: 
- Al crear este detalle, el stock del producto aumenta automáticamente
- Si se elimina la compra, los detalles también se eliminan (CASCADE)

---

### 11. **sale_items** - Items de Ventas
**Propósito**: Almacenar cada producto vendido en una venta.

**Campos Principales**:
- `quantity` - Cantidad vendida
- `unit_price` - Precio unitario
- `subtotal` - Cantidad × Precio

**Relaciones**:
- ➡️ **Pertenece a** `sales` (venta padre)
- ➡️ **Es del producto** `products` (producto vendido)

**Ejemplo**:
```
Venta #123
  ├─ Item #1:
  │   ├─ Producto: Cuaderno Norma
  │   ├─ Cantidad: 2
  │   ├─ Precio unitario: $5,000
  │   └─ Subtotal: $10,000
  │
  └─ Item #2:
      ├─ Producto: Lápiz Bic
      ├─ Cantidad: 3
      ├─ Precio unitario: $1,000
      └─ Subtotal: $3,000
```

**⚠️ Importante**: 
- Al crear este item, el stock del producto disminuye automáticamente
- Si se elimina la venta, los items también se eliminan (CASCADE)

---

### 12. **sale_payments** - Pagos de Ventas
**Propósito**: Almacenar las formas de pago de una venta (puede haber múltiples).

**Campos Principales**:
- `payment_method` - Método: `cash`, `card`, `transfer`, `nequi`, `daviplata`
- `amount` - Monto del pago
- `voucher_number` - Número de voucher (para tarjeta)
- `reference_number` - Número de referencia (para transferencia)

**Relaciones**:
- ➡️ **Pertenece a** `sales` (venta padre)

**Ejemplo**:
```
Venta #123 (Total: $13,500)
  ├─ Pago #1:
  │   ├─ Método: Efectivo
  │   └─ Monto: $10,000
  │
  └─ Pago #2:
      ├─ Método: Tarjeta
      ├─ Monto: $3,500
      └─ Voucher: 123456
```

**⚠️ Validación**: La suma de todos los pagos DEBE cubrir el total de la venta.

---

## 🔗 Diagrama de Relaciones Completo

```
┌─────────────┐
│   USERS     │
└──────┬──────┘
       │
       ├──────────────────────────────────┐
       │                                  │
       ▼                                  ▼
┌─────────────────┐              ┌──────────────┐
│ CASH_REGISTERS  │              │  PURCHASES   │
└────────┬────────┘              └──────┬───────┘
         │                              │
         │                              ▼
         │                    ┌──────────────────┐
         │                    │ PURCHASE_DETAILS │
         │                    └────────┬─────────┘
         │                             │
         ▼                             │
    ┌────────┐                         │
    │ SALES  │◄────────────────────────┤
    └───┬────┘                         │
        │                              │
        ├──────────┬───────────────────┤
        │          │                   │
        ▼          ▼                   ▼
┌──────────────┐ ┌─────────────┐ ┌──────────┐
│  SALE_ITEMS  │ │SALE_PAYMENTS│ │ PRODUCTS │
└──────────────┘ └─────────────┘ └────┬─────┘
                                      │
                                      ├────────┬────────┐
                                      ▼        ▼        ▼
                                ┌──────────┐ ┌──────┐ ┌──────────┐
                                │CATEGORIES│ │BRANDS│ │SUPPLIERS │
                                └──────────┘ └──────┘ └──────────┘
                                                            ▲
                                                            │
                                                    ┌───────┴────────┐
                                                    │   PURCHASES    │
                                                    └────────────────┘

┌──────────────┐
│  CUSTOMERS   │
└──────┬───────┘
       │
       └──────────────► SALES
```

---

## 📊 Flujo de Operaciones

### **Flujo de Compra**:
```
1. Usuario registra COMPRA
   ├─ Selecciona PROVEEDOR
   └─ Agrega PURCHASE_DETAILS
       ├─ Selecciona PRODUCTO
       ├─ Cantidad y costo
       └─ ✅ Stock aumenta automáticamente
```

### **Flujo de Venta**:
```
1. Usuario abre CASH_REGISTER
2. Usuario registra SALE
   ├─ Selecciona CLIENTE (opcional)
   ├─ Agrega SALE_ITEMS
   │   ├─ Selecciona PRODUCTO
   │   ├─ Cantidad y precio
   │   └─ ✅ Stock disminuye automáticamente
   └─ Agrega SALE_PAYMENTS
       ├─ Método de pago
       └─ ✅ Valida que cubra el total
3. Usuario cierra CASH_REGISTER
```

---

## 🎯 Resumen de Relaciones Clave

| Tabla | Relación | Descripción |
|-------|----------|-------------|
| **products** → **categories** | Muchos a Uno | Cada producto pertenece a UNA categoría |
| **products** → **brands** | Muchos a Uno | Cada producto puede tener UNA marca (opcional) |
| **products** → **suppliers** | Muchos a Uno | Cada producto puede tener UN proveedor (opcional) |
| **purchases** → **suppliers** | Muchos a Uno | Cada compra es a UN proveedor |
| **purchases** → **users** | Muchos a Uno | Cada compra es registrada por UN usuario |
| **purchase_details** → **purchases** | Muchos a Uno | Cada detalle pertenece a UNA compra |
| **purchase_details** → **products** | Muchos a Uno | Cada detalle es de UN producto |
| **sales** → **users** | Muchos a Uno | Cada venta es realizada por UN usuario |
| **sales** → **customers** | Muchos a Uno | Cada venta puede ser a UN cliente (opcional) |
| **sales** → **cash_registers** | Muchos a Uno | Cada venta se registra en UNA caja |
| **sale_items** → **sales** | Muchos a Uno | Cada item pertenece a UNA venta |
| **sale_items** → **products** | Muchos a Uno | Cada item es de UN producto |
| **sale_payments** → **sales** | Muchos a Uno | Cada pago pertenece a UNA venta |

---

## ✅ Validaciones Importantes

### **Products**:
- ✅ `barcode` debe ser único
- ✅ `sku` debe ser único
- ✅ `categoryId` es obligatorio
- ✅ `brandId` es opcional

### **Cash Registers**:
- ✅ Un usuario NO puede tener 2 cajas abiertas al mismo tiempo
- ✅ NO se puede eliminar una caja abierta

### **Sales**:
- ✅ Debe haber stock suficiente para cada producto
- ✅ La suma de pagos debe cubrir el total
- ✅ El stock se reduce automáticamente

### **Purchases**:
- ✅ El stock se incrementa automáticamente

---

## 🔄 Transacciones Atómicas

**Purchases y Sales** usan transacciones para garantizar consistencia:

```
INICIO TRANSACCIÓN
  ├─ Crear registro principal (purchase/sale)
  ├─ Crear detalles/items
  ├─ Actualizar stock de productos
  └─ Si TODO OK → COMMIT
      Si ALGO FALLA → ROLLBACK (todo se deshace)
FIN TRANSACCIÓN
```

Esto garantiza que **nunca** quede el sistema en estado inconsistente.
