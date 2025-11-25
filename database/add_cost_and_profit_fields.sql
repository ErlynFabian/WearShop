-- Agregar campo de costo a la tabla de productos
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS cost DECIMAL(10, 2) DEFAULT 0;

-- Agregar campo de ganancia a la tabla de ventas
ALTER TABLE sales 
ADD COLUMN IF NOT EXISTS cost DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS profit DECIMAL(10, 2) DEFAULT 0;

-- Comentarios para documentación
COMMENT ON COLUMN products.cost IS 'Precio de compra del producto';
COMMENT ON COLUMN sales.cost IS 'Costo total de los productos vendidos';
COMMENT ON COLUMN sales.profit IS 'Ganancia de la venta (total - cost)';

