Plan de Acción para el Frontend del MVP de Made Legal
Gracias por compartir la nueva estructura de la base de datos actualizada (MADE Legal MVP Schema - PostgreSQL, fecha 2025-11-10). He analizado los cambios (nuevos enums como LABORAL/FAMILIAR, campos hash para RGPD, RLS, nuevas tablas como procuradores y case_document_checklist, etc.) y los integraré en el plan. El enfoque sigue siendo aprender Angular (de principiante a medio/avanzado), con un MVP funcional que cumpla con PWA parcial (caching básico con Service Worker), escalabilidad, seguridad, y una cobertura de tests del ~95% (unit + E2E). Usaremos mejores prácticas (SoC, DRY, KISS, SOLID) y patrones de diseño como Feature Modules, NgRx para state management, y Reactive Forms.
Contexto ajustado:

Backend: .NET con Supabase (PostgreSQL). Usaremos HttpClient para API calls (proxy via backend para seguridad). Schema actualizado define models (e.g., clients con dni_nie_hash, cases con procurador_id).
UI: Sencillo e intuitivo (inspirado en Instagram: sidebar, cards, tablas). Angular Material para MVP (potente y simple).
Offline: PWA parcial (caching assets/data con Service Worker). Offline completo (CRUD local + sync) se planifica para cuando ganes experiencia (Fase 2).
Tests: Jasmine/Karma (unit, 95% coverage), Cypress (E2E, ~80% coverage). SonarQube para métricas.
Timeline: 7 meses (14 sprints de 2 semanas), prioridad en learning/best practices sobre velocidad.
Deploy: Vercel (PWA/HTTPS), entornos dev/prod, Dockerizado para consistencia con backend.

1. Estructura de Carpetas
Usaremos una estructura modular basada en Feature Modules (SoC: separa lógica por funcionalidad), NgRx para state (centralizado, escalable), y shared/core modules (DRY: reutilización). KISS se aplica evitando complejidad innecesaria. Carpeta raíz: src/app/.
textsrc/app/
├── core/                  # Servicios globales (singleton), configuraciones
│   ├── auth/              # Autenticación (service, guard, interceptor)
│   │   ├── auth.service.ts
│   │   ├── auth.guard.ts
│   │   └── auth.interceptor.ts
│   ├── services/          # Servicios genéricos (http, logger)
│   │   ├── http.service.ts
│   │   └── logger.service.ts
│   ├── config/            # Configuración (entornos)
│   │   └── environment.ts
│   └── core.module.ts     # Importa servicios globales
├── shared/                # Componentes/pipes reutilizables (DRY)
│   ├── components/        # UI comunes
│   │   ├── header/
│   │   │   ├── header.component.ts
│   │   │   └── header.component.html
│   │   ├── sidebar/
│   │   │   ├── sidebar.component.ts
│   │   │   └── sidebar.component.html
│   │   └── error-dialog/
│   │       ├── error-dialog.component.ts
│   │       └── error-dialog.component.html
│   ├── pipes/             # Transformaciones (e.g., date, hash)
│   │   ├── date.pipe.ts
│   │   └── hash.pipe.ts
│   └── shared.module.ts   # Exporta componentes/pipes
├── features/              # Módulos lazy-loaded (eficiencia, SoC)
│   ├── dashboard/         # Vista principal
│   │   ├── dashboard.component.ts
│   │   ├── dashboard.component.html
│   │   └── dashboard.module.ts
│   ├── clients/           # CRUD clientes
│   │   ├── list/
│   │   │   ├── client-list.component.ts
│   │   │   └── client-list.component.html
│   │   ├── form/
│   │   │   ├── client-form.component.ts
│   │   │   └── client-form.component.html
│   │   ├── clients.service.ts
│   │   ├── clients.actions.ts    # NgRx actions
│   │   ├── clients.reducer.ts    # NgRx reducer
│   │   ├── clients.effects.ts    # NgRx effects (API calls)
│   │   └── clients.module.ts
│   ├── cases/              # Agregar/mostrar casos (nacionalidad)
│   │   ├── form/
│   │   │   ├── case-form.component.ts
│   │   │   └── case-form.component.html
│   │   ├── cases.service.ts
│   │   ├── cases.actions.ts
│   │   ├── cases.reducer.ts
│   │   ├── cases.effects.ts
│   │   └── cases.module.ts
│   ├── deadlines/          # Mostrar deadlines
│   │   ├── list/
│   │   │   ├── deadline-list.component.ts
│   │   │   └── deadline-list.component.html
│   │   ├── deadlines.service.ts
│   │   ├── deadlines.actions.ts
│   │   ├── deadlines.reducer.ts
│   │   ├── deadlines.effects.ts
│   │   └── deadlines.module.ts
│   ├── documents/          # Gestión docs (Fase 2)
│   │   └── ... (futuro)
│   └── notifications/      # Alertas (Fase 2)
│       └── ... (futuro)
├── models/                # Interfaces tipadas (DRY)
│   ├── client.ts          # Basado en clients table
│   ├── case.ts            # Basado en cases table
│   ├── case-nationality.ts # Basado en case_nationality
│   ├── deadline.ts        # Basado en deadlines table
│   ├── document.ts        # Basado en documents table
│   └── user.ts            # Basado en users table
├── store/                 # NgRx state management
│   ├── app.state.ts       # Estado global
│   ├── clients/
│   │   ├── clients.actions.ts
│   │   ├── clients.reducer.ts
│   │   └── clients.effects.ts
│   ├── cases/
│   │   ├── cases.actions.ts
│   │   ├── cases.reducer.ts
│   │   └── cases.effects.ts
│   └── deadlines/
│       ├── deadlines.actions.ts
│       ├── deadlines.reducer.ts
│       └── deadlines.effects.ts
├── assets/                # Imágenes, locales
├── environments/          # Entornos (dev/prod)
│   ├── environment.ts
│   └── environment.prod.ts
└── app.module.ts          # Módulo raíz, importa core/shared

Por qué esta estructura? SoC: Separa features (dashboard, clients) de utilities (core/shared). DRY: Modelos reutilizados en services/reducers. KISS: Simple pero escalable (lazy-loading via modules). NgRx organiza estado por feature.

2. Plan Completo por Pasos (7 Meses, 14 Sprints)
Cada sprint: 2 semanas, incluye planning, do (código/tests), review (cobertura), retro (learning). Usa GitHub Projects para tracking.
Mes 1: Configuración Inicial y Dashboard Básico (Sprints 1-2)

Sprint 1 (Semanas 1-2): Config Base, PWA, Auth, Dashboard Skeleton
Tareas:
Instala: npm install -g @angular/cli@18, ng new made-legal-frontend --style=scss --routing --strict.
Añade deps: ng add @angular/material (theme Indigo/Pink), npm i @ngrx/store @ngrx/effects @ngrx/store-devtools rxjs dexie.
Configura PWA: ng add @angular/pwa, edita manifest.webmanifest (nombre "Made Legal", icons).
Crea estructura de carpetas (arriba).
Auth: Service, interceptor, guard (JWT desde backend).
Dashboard: Componente con sidebar (MatSidenav), cards placeholder.

Tests: Unit (auth.service, 95% coverage), E2E (login flow, 80%).
Learning: Angular basics (components, routing), Material, PWA intro.

Sprint 2 (Semanas 3-4): CRUD Clientes Básico
Tareas:
Model: Client (id, dni_nie_hash, first_name, etc.).
Service: ClientsService con HttpClient (GET/POST clients).
Components: ClientListComponent (MatTable), ClientFormComponent (ReactiveForm).
NgRx: Actions, reducer, effects para fetch/create clients.

Tests: Unit (service, components, 95%), E2E (CRUD flow).
Learning: ReactiveForms, NgRx basics.


Mes 2: Agregar Casos y Deadlines (Sprints 3-4)

Sprint 3 (Semanas 5-6): Agregar Caso Nacionalidad
Tareas:
Model: Case, CaseNationality (father_fullname, etc.).
Service: CasesService (POST case + nationality).
Component: CaseFormComponent (fields like exam_dele_level).
NgRx: Actions, reducer, effects.

Tests: Unit (95%), E2E (form submit).
Learning: Complex forms, NgRx effects.

Sprint 4 (Semanas 7-8): Mostrar Deadlines
Tareas:
Model: Deadline.
Service: DeadlinesService (GET deadlines).
Component: DeadlineListComponent (MatTable, filters).
NgRx: State management.

Tests: Unit (95%), E2E (table filters).
Learning: RxJS (observables), table optimization.


Mes 3-4: Offline Parcial y Polish (Sprints 5-8)

Sprint 5-6 (Semanas 9-12): PWA Parcial y Seguridad
Tareas:
PWA: Configura Service Worker (cache API responses).
Seguridad: Sanitize inputs, HTTPS (Vercel).
Polish UI: Responsive design, i18n básico (es).

Tests: Unit (95%), E2E (offline behavior).
Learning: Service Workers, security basics.

Sprint 7-8 (Semanas 13-16): Docker y Entornos
Tareas:
Dockerfile: FROM node:18, COPY . /app, RUN ng build --prod, CMD ["npx", "serve", "-s", "dist"].
Entornos: environment.ts (dev/prod URLs).
Integra SonarQube (local run).

Tests: Full coverage check.
Learning: Docker, CI basics.


Mes 5-6: Expansión MVP (Sprints 9-12)

Sprint 9-10 (Semanas 17-20): Documentos y Alertas
Tareas:
Model: Document, Alertas.
Components: Upload doc, show alerts.
NgRx: State updates.

Tests: Unit (95%), E2E.
Learning: File uploads, notifications.

Sprint 11-12 (Semanas 21-24): Facturación Básica
Tareas:
Model: Facturas.
Component: Factura form.
NgRx: Manage state.

Tests: Unit (95%), E2E.
Learning: JSON handling, forms.


Mes 7: Finalización y Deploy (Sprints 13-14)

Sprint 13-14 (Semanas 25-28): Polish, Deploy, Retros
Tareas:
Optimiza performance (lazy loading).
Deploy en Vercel (HTTPS).
Retros y documentación.

Tests: Final coverage (~95% total).
Learning: Optimization, deploy.


3. Modelos Actualizados (Basados en Schema)
typescript// models/client.ts
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

// models/case.ts
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

// models/case-nationality.ts
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
  current_stage?: 'PRESENTADO' | 'REQUERIDO' | 'EN_ESTUDIO' | 'RESUELTO_FAVORABLE' | 'RESUELTO_DESFAVORABLE' | 'RECURSO' | 'RESUELTO_RECURSO' | 'INADMITIDO_A_TRAMITE' | 'DESESTIMADO' | 'DEMANDA_CONTENCIOSA_ADMINISTRATIVA' | 'OTRO';
  oficina_extranjeria?: string;
}

// models/deadline.ts
export interface Deadline {
  id: string;
  case_id: string;
  type: 'REQUERIMIENTO_SUBSANACION' | 'SEGUIMIENTO_90D' | 'CITA_JURA' | 'REVISION_30D' | 'IMPULSO_PROCESAL' | 'OTRO';
  description?: string;
  basis_event_date: string;
  due_date: string;
  calendar_profile: 'ADMINISTRATIVO' | 'JUDICIAL';
  status: 'PENDIENTE' | 'VENCIDO' | 'COMPLETADO' | 'POSPUESTO';
  snooze_until?: string | null;
  completed_at?: string | null;
  completed_by?: string | null;
  created_at: string;
  updated_at: string;
}
4. Inicio Inmediato

Sprint 1: Crea proyecto, commit inicial en GitHub, setup Projects board.
Código inicial (dashboard.component.ts):typescriptimport { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadClients } from '../../store/clients.actions';

@Component({
  selector: 'app-dashboard',
  template: `
    <mat-sidenav-container>
      <mat-sidenav mode="side" opened>Menu</mat-sidenav>
      <mat-sidenav-content>
        <mat-card *ngFor="let client of clients$ | async">{{client.first_name}}</mat-card>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `
})
export class DashboardComponent implements OnInit {
  clients$: Observable<Client[]> = this.store.select(state => state.clients);

  constructor(private store: Store) {}

  ngOnInit() { this.store.dispatch(loadClients()); }
}

¡Empieza con Sprint 1 y pregunta si necesitas ayuda! Esto te llevará a un nivel medio/avanzado con código enterprise-ready.