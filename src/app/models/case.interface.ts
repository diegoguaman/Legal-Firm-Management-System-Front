/**
 * Case interface based on the cases table schema
 * Represents a legal case/expedient
 */
export interface Case {
  id: string;
  case_number: string;
  sequence_number: number;
  client_id: string;
  matter: 'CIVIL' | 'LABORAL' | 'FAMILIAR' | 'EXTRANJERIA' | 'TRAFICO' | 'PENAL';
  status: 'ABIERTO' | 'EN_TRAMITACION' | 'RECLAMACION_PREVIA' | 'JUDICIALIZADO' | 'CERRADO';
  opened_at: string;
  closed_at?: string | null;
  notes?: string;
  specific_data?: Record<string, any>;
  procurador_id?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

