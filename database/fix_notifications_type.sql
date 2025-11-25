-- Script para agregar 'contact_message' a los tipos permitidos en la tabla notifications
-- Ejecuta este script en el SQL Editor de Supabase

-- Primero, eliminar la restricción CHECK existente si existe
DO $$ 
BEGIN
    -- Intentar eliminar la restricción si existe
    IF EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'notifications_type_check'
    ) THEN
        ALTER TABLE notifications DROP CONSTRAINT notifications_type_check;
    END IF;
END $$;

-- Crear una nueva restricción CHECK que incluya 'contact_message'
ALTER TABLE notifications 
ADD CONSTRAINT notifications_type_check 
CHECK (type IN (
    'sale_pending',
    'sale_completed',
    'low_stock',
    'new_order',
    'product_created',
    'product_updated',
    'product_deleted',
    'product_featured',
    'product_on_sale',
    'category_created',
    'category_updated',
    'category_deleted',
    'contact_message',
    'system'
));

