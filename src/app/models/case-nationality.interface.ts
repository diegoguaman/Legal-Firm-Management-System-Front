/**
 * CaseNationality interface based on the case_nationality table schema
 * Represents nationality-specific data for EXTRANJERIA cases
 */
export interface CaseNationality {
  case_id: string;
  father_fullname?: string;
  father_nationality?: string;
  father_doc?: string | null;
  mother_fullname?: string;
  mother_nationality?: string;
  mother_doc?: string | null;
  residence_start_year?: number;
  residence_type?: 'RESIDENCIA' | 'ARRAIGO' | 'FAMILIAR_UE' | 'OTRO';
  exam_dele_level?: 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | null;
  exam_dele_date?: string | null;
  exam_ccse_score?: number | null;
  exam_ccse_passed_at?: string | null;
  submission_date?: string | null;
  current_stage?: 
    | 'PRESENTADO' 
    | 'REQUERIDO' 
    | 'EN_ESTUDIO' 
    | 'RESUELTO_FAVORABLE' 
    | 'RESUELTO_DESFAVORABLE' 
    | 'RECURSO' 
    | 'RESUELTO_RECURSO' 
    | 'INADMITIDO_A_TRAMITE' 
    | 'DESESTIMADO' 
    | 'DEMANDA_CONTENCIOSA_ADMINISTRATIVA' 
    | 'OTRO';
  oficina_extranjeria?: string;
}

