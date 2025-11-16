/**
 * Client interface based on the clients table schema
 * Represents a legal client (physical or legal entity)
 */
export interface Client {
  id: string;
  dni_nie_hash: string;
  first_name: string;
  last_name: string;
  phone_hash?: string;
  email_hash?: string;
  address_street?: string;
  address_city?: string;
  address_province?: string;
  address_zip?: string;
  nationality?: string;
  client_type: 'FISICO' | 'JURIDICO';
  extra_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

