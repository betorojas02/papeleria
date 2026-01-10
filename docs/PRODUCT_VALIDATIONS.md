# Validaciones de Productos

## ✅ Campos Únicos (No pueden repetirse)

### 1. **Barcode** (Código de barras)
- ✅ **Debe ser único** en toda la base de datos
- Validado en `create()` y `update()`
- Ejemplo: `7701234567890`
- Error si existe: `"Ya existe un Product con barcode: 7701234567890"`

### 2. **SKU** (Stock Keeping Unit)
- ✅ **Debe ser único** en toda la base de datos
- Validado en `create()` y `update()`
- Ejemplo: `CUAD-NORMA-100`
- Error si existe: `"Ya existe un Product con sku: CUAD-NORMA-100"`

## ❌ Campos que SÍ pueden repetirse

### **Nombre del Producto**
- ❌ **Puede repetirse**
- **Razón**: Puedes tener el mismo producto de diferentes marcas o proveedores
- **Ejemplos válidos**:
  - "Cuaderno 100 hojas" - Marca Norma
  - "Cuaderno 100 hojas" - Marca Scribe
  - "Cuaderno 100 hojas" - Marca Bic

## 📊 Ejemplo de Productos Válidos

```json
[
  {
    "name": "Cuaderno 100 hojas",
    "barcode": "7701234567890",
    "sku": "CUAD-NORMA-100",
    "brandId": "norma-uuid",
    "price": 5000
  },
  {
    "name": "Cuaderno 100 hojas",  // ✅ Mismo nombre OK
    "barcode": "7701234567891",    // ✅ Diferente barcode
    "sku": "CUAD-SCRIBE-100",      // ✅ Diferente SKU
    "brandId": "scribe-uuid",
    "price": 4500
  }
]
```

## 🚫 Ejemplo de Error

```json
{
  "name": "Cuaderno 200 hojas",
  "barcode": "7701234567890",  // ❌ Este barcode ya existe
  "sku": "CUAD-NORMA-200",
  "price": 6000
}
```

**Respuesta de error**:
```json
{
  "success": false,
  "message": "Ya existe un Product con barcode: 7701234567890",
  "error": {
    "code": "CONFLICT",
    "type": "ConflictException",
    "status": 409,
    "reason": "duplicate_resource",
    "resource_type": "Product",
    "field": "barcode",
    "value": "7701234567890"
  }
}
```

## 🔍 Validaciones Implementadas

### En `ProductsService.create()`:
```typescript
// 1. Validar barcode único
if (createProductDto.barcode) {
  const existing = await this.productsRepository.findOne({
    where: { barcode: createProductDto.barcode }
  });
  if (existing) {
    throw ConflictException.duplicateResource('Product', 'barcode', value);
  }
}

// 2. Validar SKU único
if (createProductDto.sku) {
  const existing = await this.productsRepository.findOne({
    where: { sku: createProductDto.sku }
  });
  if (existing) {
    throw ConflictException.duplicateResource('Product', 'sku', value);
  }
}
```

### En `ProductsService.update()`:
- Mismas validaciones pero solo si el valor cambió
- Ejemplo: Si actualizas el precio, no valida barcode/SKU
- Si actualizas barcode/SKU, valida que no exista en otro producto

## 💡 Recomendaciones

1. **Barcode**: Usar el código de barras real del producto
2. **SKU**: Crear un código interno único (ej: `CATEGORIA-MARCA-MODELO`)
3. **Nombre**: Usar nombres descriptivos, pueden repetirse
4. **Combinación única**: Barcode + SKU garantizan unicidad

## 📝 Campos Opcionales vs Requeridos

**Requeridos**:
- ✅ `name`
- ✅ `price`
- ✅ `stock`
- ✅ `categoryId`

**Opcionales**:
- ⭕ `barcode` (pero si se proporciona, debe ser único)
- ⭕ `sku` (pero si se proporciona, debe ser único)
- ⭕ `brandId`
- ⭕ `description`
- ⭕ `minStock` (default: 0)
- ⭕ `type` (default: PHYSICAL)
