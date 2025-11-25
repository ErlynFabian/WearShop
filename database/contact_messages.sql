-- Tabla para almacenar mensajes de contacto
-- Ejecuta este script en el SQL Editor de Supabase

CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas por teléfono
CREATE INDEX IF NOT EXISTS idx_contact_messages_phone ON contact_messages(phone);

-- Índice para ordenar por fecha de creación
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Índice para filtrar mensajes no leídos
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(read) WHERE read = FALSE;

-- Habilitar Row Level Security (RLS)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Política para permitir que cualquier usuario inserte mensajes (público)
CREATE POLICY "Permitir inserción pública de mensajes de contacto"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Política para que solo usuarios autenticados puedan leer mensajes
-- Ajusta esto según tus necesidades de autenticación
CREATE POLICY "Permitir lectura de mensajes a usuarios autenticados"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Política para permitir actualizar el estado de lectura
CREATE POLICY "Permitir actualizar estado de lectura"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política para permitir eliminar mensajes
CREATE POLICY "Permitir eliminar mensajes"
  ON contact_messages
  FOR DELETE
  TO authenticated
  USING (true);

-- Función para crear notificación automáticamente cuando se inserta un mensaje de contacto
-- Nota: Asegúrate de que la tabla 'notifications' exista antes de ejecutar esto
CREATE OR REPLACE FUNCTION create_contact_message_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar notificación en la tabla notifications
  -- Usar SECURITY DEFINER para ejecutar con permisos de superusuario
  INSERT INTO notifications (
    type,
    title,
    message,
    read,
    link,
    created_at
  ) VALUES (
    'contact_message',
    'Nuevo mensaje de contacto',
    NEW.name || ' (' || NEW.phone || ') ha enviado un mensaje',
    false,
    '/admin/contact-messages',
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear el trigger que ejecuta la función cuando se inserta un mensaje
DROP TRIGGER IF EXISTS trigger_create_contact_message_notification ON contact_messages;
CREATE TRIGGER trigger_create_contact_message_notification
  AFTER INSERT ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION create_contact_message_notification();

-- IMPORTANTE: Actualizar la restricción CHECK de la tabla notifications para incluir 'contact_message'
-- Esto es necesario para que las notificaciones de contacto puedan crearse correctamente
DO $$ 
BEGIN
    -- Eliminar la restricción CHECK existente si existe
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

