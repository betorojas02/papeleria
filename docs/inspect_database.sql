-- 📊 Script para ver toda la información del schema

-- ============================================
-- 1. VER TODAS LAS TABLAS
-- ============================================
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
ORDER BY table_name;

-- ============================================
-- 2. VER TODAS LAS COLUMNAS CON TIPOS Y LONGITUDES
-- ============================================
SELECT 
    table_name,
    column_name,
    data_type,
    CASE 
        WHEN character_maximum_length IS NOT NULL 
        THEN data_type || '(' || character_maximum_length || ')'
        WHEN numeric_precision IS NOT NULL 
        THEN data_type || '(' || numeric_precision || ',' || numeric_scale || ')'
        ELSE data_type
    END as full_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- ============================================
-- 3. VER TODAS LAS FOREIGN KEYS
-- ============================================
SELECT
    tc.table_name as tabla,
    kcu.column_name as columna,
    ccu.table_name AS tabla_referenciada,
    ccu.column_name AS columna_referenciada,
    rc.delete_rule as on_delete
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name, kcu.column_name;

-- ============================================
-- 4. VER TODOS LOS ÍNDICES
-- ============================================
SELECT
    tablename as tabla,
    indexname as indice,
    indexdef as definicion
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ============================================
-- 5. VER PRIMARY KEYS
-- ============================================
SELECT
    tc.table_name as tabla,
    kcu.column_name as columna_pk
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'PRIMARY KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- ============================================
-- 6. VER UNIQUE CONSTRAINTS
-- ============================================
SELECT
    tc.table_name as tabla,
    kcu.column_name as columna_unique
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'UNIQUE'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- ============================================
-- 7. VER TAMAÑO DE TABLAS
-- ============================================
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ============================================
-- 8. CONTAR REGISTROS EN CADA TABLA
-- ============================================
SELECT 
    schemaname,
    tablename,
    n_live_tup as row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;

-- ============================================
-- 9. VER COLUMNAS ESPECÍFICAS DE UNA TABLA (EJEMPLO: products)
-- ============================================
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    numeric_precision,
    numeric_scale,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- ============================================
-- 10. GENERAR CREATE TABLE STATEMENTS
-- ============================================
-- Para PostgreSQL, usa pg_dump:
-- pg_dump -U postgres -d papeleria_db --schema-only > schema.sql
