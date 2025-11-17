/**
 * Client interface
 * 
 * IMPORTANTE SEGURIDAD:
 * - Los datos sensibles (dni_nie, phone, email) están ENCRIPTADOS en la base de datos
 * - El backend los DESENCRIPTA antes de enviarlos al frontend
 * - El frontend siempre recibe datos legibles para uso práctico (autocompletar documentos, etc.)
 * - El hash solo se usa para passwords (nunca para datos que necesitan ser legibles)
 * 
 * Ver SEGURIDAD_DATOS.md para más detalles sobre la estrategia de seguridad
 */
export interface Client {
  id: string;
  
  // Datos sensibles (encriptados en BD, desencriptados por backend)
  dni_nie: string;              // Cambiado de dni_nie_hash - ahora legible
  phone?: string;               // Cambiado de phone_hash - ahora legible
  email?: string;               // Cambiado de email_hash - ahora legible
  
  // Datos no sensibles (sin encriptar)
  first_name: string;
  last_name: string;
  address_street?: string;
  address_city?: string;
  address_province?: string;
  address_zip?: string;
  nationality?: string;
  client_type: 'FISICO' | 'JURIDICO';
  extra_data?: Record<string, any>;
  
  // Metadatos
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

