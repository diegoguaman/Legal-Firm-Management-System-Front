# Plan de Trabajo: Made Legal Frontend - MVP por Fases

## 🎯 Objetivo
Crear un MVP funcional con datos hardcodeados para presentar diseño y funcionalidad al cliente, mientras aprendemos Angular de forma estructurada.

---

## 📋 Fase 1: Configuración y Estructura (Semana 1)

### Objetivos de Aprendizaje
- Entender la arquitectura de Angular (standalone components, modules)
- Configurar NgRx Store
- Estructura de carpetas escalable
- Conceptos de State Management

### Tareas Técnicas

#### 1.1 Instalación de Dependencias
```bash
# Angular Material
ng add @angular/material

# NgRx
npm install @ngrx/store @ngrx/effects @ngrx/store-devtools @ngrx/entity

# RxJS (ya incluido, pero verificar versión)
npm install rxjs
```

#### 1.2 Crear Estructura de Carpetas
```
src/app/
├── core/
│   ├── services/
│   │   ├── http.service.ts
│   │   └── logger.service.ts
│   └── core.config.ts
├── shared/
│   ├── components/
│   │   ├── header/
│   │   ├── sidebar/
│   │   └── loading-spinner/
│   ├── pipes/
│   │   └── date-format.pipe.ts
│   └── shared.config.ts
├── features/
│   ├── dashboard/
│   ├── clients/
│   └── cases/
├── models/
│   ├── client.interface.ts
│   ├── case.interface.ts
│   └── case-nationality.interface.ts
└── store/
    ├── index.ts
    ├── app.state.ts
    ├── clients/
    │   ├── clients.actions.ts
    │   ├── clients.reducer.ts
    │   ├── clients.effects.ts
    │   └── clients.selectors.ts
    └── cases/
        ├── cases.actions.ts
        ├── cases.reducer.ts
        ├── cases.effects.ts
        └── cases.selectors.ts
```

#### 1.3 Configurar NgRx Store
- Crear `app.state.ts` con estructura inicial
- Configurar StoreModule en `app.config.ts`
- Configurar StoreDevtoolsModule (solo desarrollo)

#### 1.4 Crear Modelos TypeScript
- `Client` interface
- `Case` interface
- `CaseNationality` interface

#### 1.5 Crear Datos Mock (Hardcoded)
- Archivo `mock-data.ts` con datos de ejemplo
- 5-10 clientes de ejemplo
- 3-5 casos de ejemplo

### Entregables
- ✅ Proyecto configurado con NgRx
- ✅ Estructura de carpetas creada
- ✅ Modelos TypeScript definidos
- ✅ Datos mock disponibles
- ✅ Store configurado y funcionando

### Documentación a Crear
- `ESTRUCTURA_PROYECTO.md`: Explicación de cada carpeta y su propósito
- `NGNX_SETUP.md`: Cómo se configuró NgRx y por qué

---

## 📋 Fase 2: CRUD de Clientes (Semanas 2-3)

### Objetivos de Aprendizaje
- Reactive Forms en Angular
- NgRx: Actions, Reducers, Effects, Selectors
- Componentes reutilizables
- Material Design components

### Tareas Técnicas

#### 2.1 Crear Feature Module de Clientes
```typescript
// features/clients/clients.routes.ts
export const clientsRoutes: Routes = [
  { path: '', component: ClientListComponent },
  { path: 'new', component: ClientFormComponent },
  { path: ':id/edit', component: ClientFormComponent }
];
```

#### 2.2 Implementar Store de Clientes

**Actions:**
- `loadClients` - Cargar lista
- `loadClientsSuccess` - Éxito al cargar
- `loadClientsFailure` - Error al cargar
- `addClient` - Agregar cliente
- `updateClient` - Actualizar cliente
- `deleteClient` - Eliminar cliente (soft delete)
- `selectClient` - Seleccionar cliente

**Reducer:**
```typescript
interface ClientsState {
  items: Client[];
  loading: boolean;
  error: string | null;
  selectedClientId: string | null;
}
```

**Effects:**
- `loadClients$` - Carga desde mock data
- `addClient$` - Agrega a mock data
- `updateClient$` - Actualiza mock data

**Selectors:**
- `selectAllClients`
- `selectClientsLoading`
- `selectClientsError`
- `selectClientById`
- `selectSelectedClient`

#### 2.3 Crear Componentes

**ClientListComponent:**
- Tabla con Angular Material (MatTable)
- Columnas: Nombre, Apellido, Tipo, Nacionalidad
- Botón "Nuevo Cliente"
- Botón "Editar" por fila
- Filtro de búsqueda
- Paginación (opcional)

**ClientFormComponent:**
- Reactive Form con validaciones
- Campos según modelo Client
- Validación de DNI/NIE (formato)
- Botones: Guardar, Cancelar
- Manejo de errores

#### 2.4 Servicio de Clientes (Mock)
```typescript
@Injectable({ providedIn: 'root' })
export class ClientsService {
  // Simula delay de API
  getClients(): Observable<Client[]> {
    return of(MOCK_CLIENTS).pipe(delay(500));
  }

  addClient(client: Client): Observable<Client> {
    const newClient = { ...client, id: uuid() };
    return of(newClient).pipe(delay(300));
  }
}
```

### Entregables
- ✅ Lista de clientes funcionando
- ✅ Formulario de creación/edición
- ✅ Store completo con datos mock
- ✅ UI responsive y atractiva

### Documentación a Crear
- `CRUD_CLIENTES.md`: Explicación del flujo completo
- `REACTIVE_FORMS.md`: Cómo funcionan los formularios reactivos
- `NGRX_FLOW.md`: Flujo de datos con NgRx (diagrama)

---

## 📋 Fase 3: Agregar Expediente y Caso de Nacionalidad (Semanas 4-5)

### Objetivos de Aprendizaje
- Formularios complejos con múltiples secciones
- Relaciones entre entidades (Client → Case → CaseNationality)
- Nested forms y FormArrays
- Validaciones condicionales

### Tareas Técnicas

#### 3.1 Crear Feature Module de Casos
```typescript
// features/cases/cases.routes.ts
export const casesRoutes: Routes = [
  { path: '', component: CaseListComponent },
  { path: 'new/:clientId', component: CaseFormComponent },
  { path: ':id', component: CaseDetailComponent }
];
```

#### 3.2 Implementar Store de Casos

**Actions:**
- `loadCases` - Cargar casos
- `loadCasesByClient` - Cargar casos de un cliente
- `addCase` - Agregar caso
- `addCaseWithNationality` - Agregar caso + nacionalidad
- `updateCase` - Actualizar caso
- `selectCase` - Seleccionar caso

**Reducer:**
```typescript
interface CasesState {
  items: Case[];
  nationalities: Record<string, CaseNationality>; // case_id -> nationality
  loading: boolean;
  error: string | null;
  selectedCaseId: string | null;
}
```

**Effects:**
- `loadCases$` - Carga desde mock
- `addCaseWithNationality$` - Crea caso y nacionalidad

**Selectors:**
- `selectAllCases`
- `selectCasesByClient`
- `selectCaseById`
- `selectCaseNationality`

#### 3.3 Crear Componentes

**CaseFormComponent:**
- Formulario en pasos (Stepper de Material)
  - Paso 1: Datos del caso (matter, status, notes)
  - Paso 2: Datos de nacionalidad (father, mother, residence)
  - Paso 3: Exámenes (DELE, CCSE)
  - Paso 4: Estado actual (current_stage, oficina)
- Validaciones:
  - Si matter = 'EXTRANJERIA', mostrar campos de nacionalidad
  - Validar fechas
  - Validar niveles DELE

**CaseDetailComponent:**
- Vista de detalle del caso
- Muestra datos del caso
- Muestra datos de nacionalidad (si aplica)
- Lista de deadlines relacionados
- Botón "Agregar Deadline" (futuro)

**CaseListComponent:**
- Tabla de casos
- Filtro por cliente
- Filtro por matter
- Filtro por status

#### 3.4 Relación Cliente → Caso
- En ClientDetailComponent, mostrar casos del cliente
- En CaseFormComponent, pre-seleccionar cliente si viene de ruta

### Entregables
- ✅ Formulario de caso completo
- ✅ Formulario de nacionalidad integrado
- ✅ Vista de detalle de caso
- ✅ Relación cliente-caso funcionando

### Documentación a Crear
- `FORMULARIOS_COMPLEJOS.md`: Stepper, FormArrays, validaciones condicionales
- `RELACIONES_ENTIDADES.md`: Cómo manejar relaciones en NgRx
- `CASO_NACIONALIDAD.md`: Lógica de negocio del caso de nacionalidad

---

## 📋 Fase 4: UI/UX y Presentación (Semana 6)

### Objetivos de Aprendizaje
- Diseño responsive
- Mejores prácticas de UX
- Angular Material theming
- Animaciones y transiciones

### Tareas Técnicas

#### 4.1 Layout Principal
- Header con logo y navegación
- Sidebar con menú
- Área de contenido principal
- Footer (opcional)

#### 4.2 Theming
- Crear tema personalizado
- Colores de marca
- Tipografía
- Componentes customizados

#### 4.3 Mejoras de UX
- Loading states
- Empty states
- Error states
- Confirmaciones de acciones
- Toast notifications (opcional)

#### 4.4 Responsive Design
- Mobile-first approach
- Breakpoints de Material
- Sidebar colapsable en mobile
- Tablas responsive

### Entregables
- ✅ UI profesional y pulida
- ✅ Diseño responsive
- ✅ Experiencia de usuario fluida

---

## 📋 Fase 5: Optimización y Preparación para Demo (Semana 7)

### Objetivos de Aprendizaje
- Performance optimization
- Change detection strategies
- Lazy loading
- Code splitting

### Tareas Técnicas

#### 5.1 Optimizaciones
- Implementar OnPush en componentes
- Lazy load feature modules
- Optimizar imágenes
- Minificar y comprimir

#### 5.2 Testing Básico
- Unit tests para servicios críticos
- Component tests básicos
- E2E test del flujo principal

#### 5.3 Documentación Final
- README actualizado
- Guía de uso
- Documentación técnica completa

### Entregables
- ✅ Aplicación optimizada
- ✅ Tests básicos funcionando
- ✅ Documentación completa

---

## 🎓 Conceptos Clave por Fase

### Fase 1: Fundamentos
- **Standalone Components**: Nueva forma de crear componentes en Angular
- **Dependency Injection**: Cómo Angular inyecta servicios
- **NgRx Store**: Arquitectura Redux en Angular
- **TypeScript Interfaces**: Tipado fuerte

### Fase 2: CRUD y State Management
- **Reactive Forms**: FormBuilder, FormGroup, FormControl
- **NgRx Flow**: Actions → Effects → Reducer → Store → Component
- **Observables**: RxJS operators (map, switchMap, catchError)
- **Material Components**: MatTable, MatFormField, MatButton

### Fase 3: Formularios Complejos
- **Stepper**: Formularios multi-paso
- **FormArrays**: Arrays dinámicos en formularios
- **Validaciones Condicionales**: Validators personalizados
- **Relaciones**: Cómo manejar relaciones entre entidades

### Fase 4: UI/UX
- **Responsive Design**: Mobile-first, breakpoints
- **Theming**: Personalización de Material
- **UX Patterns**: Loading, empty, error states

### Fase 5: Optimización
- **OnPush**: Change detection optimizado
- **Lazy Loading**: Carga bajo demanda
- **Performance**: Métricas y optimizaciones

---

## 📝 Checklist de Aprendizaje

### Conceptos Angular
- [ ] Standalone Components
- [ ] Dependency Injection
- [ ] Routing y Lazy Loading
- [ ] Reactive Forms
- [ ] Change Detection
- [ ] Pipes y Directives

### NgRx
- [ ] Actions y Action Creators
- [ ] Reducers (funciones puras)
- [ ] Effects (side effects)
- [ ] Selectors (memoización)
- [ ] Store DevTools

### RxJS
- [ ] Observables y Observers
- [ ] Operators (map, filter, switchMap, catchError)
- [ ] Subjects (BehaviorSubject, ReplaySubject)
- [ ] Async Pipe

### Material Design
- [ ] Componentes básicos (Button, Card, Table)
- [ ] Formularios (FormField, Input, Select)
- [ ] Layout (Sidenav, Toolbar)
- [ ] Theming

### Best Practices
- [ ] TypeScript strict mode
- [ ] Interfaces y tipos
- [ ] Error handling
- [ ] Code organization
- [ ] Testing básico

---

## 🚀 Próximos Pasos Después del MVP

1. **Integración con Backend**: Reemplazar mock data con API real
2. **Autenticación**: Login y gestión de sesión
3. **PWA Completo**: Service Worker, IndexedDB, sincronización offline
4. **Deadlines**: Gestión de plazos y alertas
5. **Documentos**: Subida y gestión de documentos
6. **Reportes**: Dashboard con métricas

---

## 📚 Recursos de Aprendizaje

### Documentación Oficial
- [Angular Docs](https://angular.dev)
- [NgRx Docs](https://ngrx.io)
- [Angular Material](https://material.angular.io)
- [RxJS Docs](https://rxjs.dev)

### Artículos Recomendados
- "NgRx: Complete Guide" - Angular University
- "Reactive Forms Deep Dive" - Angular Blog
- "Angular Performance Optimization" - Netanel Basal

### Práctica
- Crear pequeños proyectos paralelos
- Experimentar con conceptos nuevos
- Leer código de proyectos open source

---

**Nota**: Este plan está diseñado para aprender mientras construyes. Tómate el tiempo necesario para entender cada concepto antes de avanzar.

