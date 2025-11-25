-- Script de migración: Cambiar columna email por phone en contact_messages
-- Ejecuta este script si ya tienes la tabla creada con la columna email

-- Agregar columna phone si no existe
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Hacer que email sea opcional (nullable) para permitir la transición
DO $$ 
BEGIN
  -- Intentar hacer email nullable
  BEGIN
    ALTER TABLE contact_messages 
    ALTER COLUMN email DROP NOT NULL;
  EXCEPTION WHEN OTHERS THEN
    -- Si la columna no existe o ya es nullable, continuar
    NULL;
  END;
END $$;

-- Hacer que phone sea obligatorio (solo si no tiene datos o todos tienen phone)
DO $$ 
BEGIN
  -- Verificar si hay registros sin phone
  IF NOT EXISTS (SELECT 1 FROM contact_messages WHERE phone IS NULL OR phone = '') THEN
    ALTER TABLE contact_messages 
    ALTER COLUMN phone SET NOT NULL;
  END IF;
END $$;

-- Si hay datos existentes, copiar email a phone (opcional)
-- UPDATE contact_messages SET phone = email WHERE phone IS NULL OR phone = '';

-- Eliminar índice de email si existe
DROP INDEX IF EXISTS idx_contact_messages_email;

-- Crear índice para phone
CREATE INDEX IF NOT EXISTS idx_contact_messages_phone ON contact_messages(phone);

-- Eliminar columna email (descomenta esta línea cuando estés seguro de que no la necesitas)
-- ALTER TABLE contact_messages DROP COLUMN IF EXISTS email;

-- Actualizar el trigger para usar phone
CREATE OR REPLACE FUNCTION create_contact_message_notification()
RETURNS TRIGGER AS $$
BEGIN
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
    NEW.name || ' (' || COALESCE(NEW.phone, NEW.email, 'Sin contacto') || ') ha enviado un mensaje',
    false,
    '/admin/contact-messages',
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

