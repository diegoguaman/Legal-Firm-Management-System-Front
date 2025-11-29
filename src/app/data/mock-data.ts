/**
 * Mock data for development and client presentation
 * This will be replaced with real API calls in later phases
 */
import { Client, Case, CaseNationality } from '../models';

export const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    dni_nie: '12345678A',
    first_name: 'Juan',
    last_name: 'Pérez García',
    phone: '+34 612 345 678',
    email: 'juan.perez@example.com',
    address_street: 'Calle Mayor 123',
    address_city: 'Madrid',
    address_province: 'Madrid',
    address_zip: '28001',
    nationality: 'Española',
    client_type: 'FISICO',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    deleted_at: null
  },
  {
    id: '2',
    dni_nie: '87654321B',
    first_name: 'María',
    last_name: 'González López',
    phone: '+34 623 456 789',
    email: 'maria.gonzalez@example.com',
    address_street: 'Avenida de la Paz 45',
    address_city: 'Barcelona',
    address_province: 'Barcelona',
    address_zip: '08001',
    nationality: 'Colombiana',
    client_type: 'FISICO',
    created_at: '2024-02-10T14:30:00Z',
    updated_at: '2024-02-10T14:30:00Z',
    deleted_at: null
  },
  {
    id: '3',
    dni_nie: '11223344C',
    first_name: 'Carlos',
    last_name: 'Martínez Ruiz',
    phone: '+34 634 567 890',
    email: 'carlos.martinez@example.com',
    address_street: 'Plaza del Sol 7',
    address_city: 'Valencia',
    address_province: 'Valencia',
    address_zip: '46001',
    nationality: 'Venezolana',
    client_type: 'FISICO',
    created_at: '2024-03-05T09:15:00Z',
    updated_at: '2024-03-05T09:15:00Z',
    deleted_at: null
  },
  {
    id: '4',
    dni_nie: '99887766D',
    first_name: 'Ana',
    last_name: 'Sánchez Fernández',
    phone: '+34 645 678 901',
    email: 'ana.sanchez@example.com',
    address_street: 'Calle Nueva 22',
    address_city: 'Sevilla',
    address_province: 'Sevilla',
    address_zip: '41001',
    nationality: 'Ecuatoriana',
    client_type: 'FISICO',
    created_at: '2024-03-20T11:45:00Z',
    updated_at: '2024-03-20T11:45:00Z',
    deleted_at: null
  },
  {
    id: '5',
    dni_nie: 'B55667788',
    first_name: 'Empresa',
    last_name: 'Legal S.L.',
    phone: '+34 656 789 012',
    email: 'info@empresalegal.es',
    address_street: 'Paseo de la Castellana 100',
    address_city: 'Madrid',
    address_province: 'Madrid',
    address_zip: '28046',
    nationality: 'Española',
    client_type: 'JURIDICO',
    created_at: '2024-04-01T08:00:00Z',
    updated_at: '2024-04-01T08:00:00Z',
    deleted_at: null
  }
];

export const MOCK_CASES: Case[] = [
  {
    id: 'case-1',
    case_number: '2024-001',
    sequence_number: 1,
    client_id: '2',
    matter: 'EXTRANJERIA',
    status: 'EN_TRAMITACION',
    opened_at: '2024-02-15T10:00:00Z',
    closed_at: null,
    notes: 'Caso de nacionalidad por residencia. Cliente necesita completar documentación.',
    procurador_id: null,
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-02-15T10:00:00Z',
    deleted_at: null
  },
  {
    id: 'case-2',
    case_number: '2024-002',
    sequence_number: 1,
    client_id: '3',
    matter: 'LABORAL',
    status: 'ABIERTO',
    opened_at: '2024-03-10T09:00:00Z',
    closed_at: null,
    notes: 'Despido improcedente. Reunión con cliente programada para revisar documentos.',
    procurador_id: null,
    created_at: '2024-03-10T09:00:00Z',
    updated_at: '2024-03-10T09:00:00Z',
    deleted_at: null
  },
  {
    id: 'case-3',
    case_number: '2024-003',
    sequence_number: 1,
    client_id: '1',
    matter: 'FAMILIAR',
    status: 'JUDICIALIZADO',
    opened_at: '2024-01-20T14:00:00Z',
    closed_at: null,
    notes: 'Proceso de divorcio. En fase de negociación.',
    procurador_id: null,
    created_at: '2024-01-20T14:00:00Z',
    updated_at: '2024-01-20T14:00:00Z',
    deleted_at: null
  },
  {
    id: 'case-4',
    case_number: '2024-004',
    sequence_number: 1,
    client_id: '4',
    matter: 'EXTRANJERIA',
    status: 'EN_TRAMITACION',
    opened_at: '2024-04-05T11:00:00Z',
    closed_at: null,
    notes: 'Solicitud de nacionalidad. Documentación completa.',
    procurador_id: null,
    created_at: '2024-04-05T11:00:00Z',
    updated_at: '2024-04-05T11:00:00Z',
    deleted_at: null
  }
];

export const MOCK_CASE_NATIONALITIES: CaseNationality[] = [
  {
    case_id: 'case-1',
    father_fullname: 'José González',
    father_nationality: 'Colombiana',
    father_doc: 'CC123456789',
    mother_fullname: 'Carmen López',
    mother_nationality: 'Colombiana',
    mother_doc: 'CC987654321',
    residence_start_year: 2018,
    residence_type: 'RESIDENCIA',
    exam_dele_level: 'B1',
    exam_dele_date: '2023-06-15',
    exam_ccse_score: 85,
    exam_ccse_passed_at: '2023-07-20',
    submission_date: '2024-02-20',
    current_stage: 'EN_ESTUDIO',
    oficina_extranjeria: 'Oficina de Extranjería de Barcelona'
  }
];

