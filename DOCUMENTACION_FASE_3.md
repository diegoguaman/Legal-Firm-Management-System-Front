# Documentación Fase 3: Expedientes y Casos de Nacionalidad

## 📋 Resumen

La Fase 3 implementa la gestión completa de casos legales con:
- ✅ Lista de casos con filtros avanzados
- ✅ Formulario multi-paso (Stepper) para crear/editar casos
- ✅ Formulario de nacionalidad integrado (solo para EXTRANJERIA)
- ✅ Vista de detalle de caso
- ✅ Relación cliente-caso funcionando
- ✅ Integración completa con NgRx Store

---

## 🏗️ Arquitectura Implementada

### Estructura de Archivos

```
src/app/features/cases/
├── case-list/
│   ├── case-list.component.ts
│   ├── case-list.component.html
│   └── case-list.component.scss
├── case-form/
│   ├── case-form.component.ts
│   ├── case-form.component.html
│   └── case-form.component.scss
├── case-detail/
│   ├── case-detail.component.ts
│   ├── case-detail.component.html
│   └── case-detail.component.scss
└── cases.routes.ts

src/app/store/cases/
├── cases.actions.ts
├── cases.reducer.ts
├── cases.effects.ts
└── cases.selectors.ts
```

---

## 🔄 Flujo de Datos Completo

### Crear Caso con Nacionalidad

```
┌─────────────────┐
│  CaseForm       │
│  (Stepper)      │
└────────┬────────┘
         │ Usuario completa formulario
         │ Paso 1: Datos del caso
         │ Paso 2: Nacionalidad (si EXTRANJERIA)
         │ Paso 3: Exámenes
         │ Paso 4: Estado actual
         ▼
┌─────────────────┐
│  onSubmit()     │
│  dispatch(      │
│    addCaseWith  │
│    Nationality) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Action      │
│addCaseWith      │
│Nationality      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Effect      │
│addCaseWith      │
│Nationality$     │
└────────┬────────┘
         │ switchMap()
         ▼
┌─────────────────┐
│    Service      │
│ CasesService    │
│addCaseWith      │
│Nationality()    │
└────────┬────────┘
         │ Observable
         ▼
┌─────────────────┐
│     Action      │
│addCaseSuccess   │
│{case, nationality}│
└────────┬────────┘
         │ dispatch()
         ▼
┌─────────────────┐
│    Reducer      │
│ casesReducer    │
└────────┬────────┘
         │ new state
         ▼
┌─────────────────┐
│     Store       │
│  AppState       │
│ cases: {        │
│   items: [...], │
│   nationalities:│
│   {case_id: nat}│
│ }               │
└─────────────────┘
```

---

## 📦 Componentes Detallados

### 1. CaseListComponent

#### Responsabilidades
- Mostrar lista de casos en tabla
- Filtros múltiples (matter, status, cliente, texto)
- Navegar a detalle de caso
- Integración con clientes (mostrar nombre del cliente)

#### Características Clave

**Filtros Múltiples:**
```typescript
// Filtro por texto
filterValue: string = '';

// Filtro por materia
selectedMatter: string = 'ALL';

// Filtro por estado
selectedStatus: string = 'ALL';

// Filtro por cliente
selectedClientId: string = 'ALL';
```

**Función de Filtrado:**
```typescript
filterCases(cases: Case[], clients: any[]): Case[] {
  let filtered = [...cases];
  
  // Aplicar múltiples filtros
  if (this.filterValue) { /* filtro texto */ }
  if (this.selectedMatter !== 'ALL') { /* filtro materia */ }
  if (this.selectedStatus !== 'ALL') { /* filtro estado */ }
  if (this.selectedClientId !== 'ALL') { /* filtro cliente */ }
  
  return filtered;
}
```

---

### 2. CaseFormComponent (Stepper Multi-Paso)

#### Responsabilidades
- Formulario en 4 pasos usando Material Stepper
- Validaciones condicionales
- Manejo de formularios anidados
- Integración con cliente desde ruta

#### Estructura del Stepper

**Paso 1: Datos del Caso**
- Número de caso
- Cliente (pre-seleccionado si viene de ruta)
- Materia
- Estado
- Notas

**Paso 2: Datos de Nacionalidad** (solo si matter = EXTRANJERIA)
- Información del padre
- Información de la madre
- Residencia

**Paso 3: Exámenes** (solo si matter = EXTRANJERIA)
- Examen DELE (nivel, fecha)
- Examen CCSE (puntuación, fecha de aprobación)

**Paso 4: Estado Actual** (solo si matter = EXTRANJERIA)
- Etapa actual
- Fecha de presentación
- Oficina de extranjería

#### Conceptos Clave

**1. Stepper Lineal:**
```html
<mat-stepper #stepper linear>
```
- `linear`: No permite avanzar si el paso actual no es válido
- Cada paso tiene su propio `[stepControl]`

**2. Validación Condicional:**
```typescript
shouldShowNationalityStep(): boolean {
  return this.caseForm.get('matter')?.value === 'EXTRANJERIA';
}
```

**3. Formularios Anidados:**
```typescript
// Form principal
caseForm: FormGroup;

// Form de nacionalidad (solo si EXTRANJERIA)
nationalityForm: FormGroup;
```

**4. Navegación entre Pasos:**
```html
<button mat-raised-button matStepperNext>Siguiente</button>
<button mat-button matStepperPrevious>Anterior</button>
```

**5. Pre-seleccionar Cliente:**
```typescript
private checkClientFromRoute(): void {
  this.clientId = this.route.snapshot.paramMap.get('clientId');
  if (this.clientId) {
    this.caseForm.patchValue({ client_id: this.clientId });
  }
}
```

---

### 3. CaseDetailComponent

#### Responsabilidades
- Mostrar información completa del caso
- Mostrar datos de nacionalidad (si aplica)
- Mostrar información del cliente relacionado
- Navegación a edición

#### Características

**Carga de Datos Relacionados:**
```typescript
// Cargar caso
this.case$ = this.store.select(selectCaseById(this.caseId));

// Cargar nacionalidad
this.nationality$ = this.store.select(selectCaseNationality(this.caseId));

// Cargar cliente
this.case$.pipe(take(1)).subscribe(caseItem => {
  if (caseItem) {
    this.client$ = this.store.select(selectClientById(caseItem.client_id));
  }
});
```

**Renderizado Condicional:**
```html
@if (isExtranjeria(caseItem) && (nationality$ | async); as nationality) {
  <!-- Mostrar datos de nacionalidad -->
}
```

---

## 🔄 Store de Casos

### State Structure

```typescript
interface CasesState {
  items: Case[];                                    // Todos los casos
  nationalities: Record<string, CaseNationality>;  // case_id -> nationality
  loading: boolean;
  error: string | null;
  selectedCaseId: string | null;
}
```

**Por qué Record para nationalities:**
- Búsqueda rápida O(1) por case_id
- No todos los casos tienen nacionalidad (solo EXTRANJERIA)
- Fácil de actualizar individualmente

### Actions Implementadas

```typescript
// Cargar
loadCases()
loadCasesSuccess({ cases, nationalities })
loadCasesFailure({ error })
loadCasesByClient({ clientId })

// Crear
addCase({ case })
addCaseWithNationality({ case, nationality })
addCaseSuccess({ case, nationality? })

// Actualizar
updateCase({ case })
updateCaseSuccess({ case })

// Seleccionar
selectCase({ caseId })
clearSelectedCase()
```

### Reducer - Manejo de Nationalities

```typescript
on(CasesActions.loadCasesSuccess, (state, { cases, nationalities }) => {
  // Convertir array a Record
  const nationalitiesMap: Record<string, CaseNationality> = {};
  nationalities.forEach(nat => {
    nationalitiesMap[nat.case_id] = nat;
  });
  
  return {
    ...state,
    items: cases,
    nationalities: nationalitiesMap,  // Record para búsqueda rápida
    loading: false
  };
})
```

### Selectors Especializados

```typescript
// Casos por cliente
export const selectCasesByClient = (clientId: string) =>
  createSelector(
    selectAllCases,
    (cases: Case[]) => cases.filter(c => c.client_id === clientId)
  );

// Nacionalidad por caso
export const selectCaseNationality = (caseId: string) =>
  createSelector(
    selectCasesState,
    (state: CasesState) => state.nationalities[caseId] || null
  );
```

---

## 🎨 Material Stepper

### Configuración

```html
<mat-stepper #stepper linear>
  <mat-step [stepControl]="caseForm" label="Datos del Caso">
    <!-- Contenido del paso -->
  </mat-step>
</mat-stepper>
```

**Propiedades:**
- `linear`: Requiere validación antes de avanzar
- `[stepControl]`: FormGroup que valida el paso
- `label`: Título del paso

### Navegación

```html
<!-- Avanzar -->
<button mat-raised-button matStepperNext>Siguiente</button>

<!-- Retroceder -->
<button mat-button matStepperPrevious>Anterior</button>

<!-- Finalizar -->
<button mat-raised-button type="submit">Guardar</button>
```

---

## 🔗 Relación Cliente-Caso

### Desde Cliente → Caso

**En ClientListComponent:**
```html
<button mat-icon-button 
        [routerLink]="['/cases', 'new', client.id]">
  <mat-icon>folder_open</mat-icon>
</button>
```

**Ruta:**
```typescript
{
  path: 'new/:clientId',
  component: CaseFormComponent
}
```

**En CaseFormComponent:**
```typescript
private checkClientFromRoute(): void {
  this.clientId = this.route.snapshot.paramMap.get('clientId');
  if (this.clientId) {
    this.caseForm.patchValue({ client_id: this.clientId });
  }
}
```

### Desde Caso → Cliente

**En CaseDetailComponent:**
```typescript
// Obtener cliente del caso
this.case$.pipe(take(1)).subscribe(caseItem => {
  if (caseItem) {
    this.client$ = this.store.select(selectClientById(caseItem.client_id));
  }
});
```

---

## ✅ Validaciones Implementadas

### Validaciones del Caso

```typescript
caseForm = this.fb.group({
  case_number: ['', [Validators.required]],
  client_id: ['', [Validators.required]],
  matter: ['EXTRANJERIA', Validators.required],
  status: ['ABIERTO', Validators.required],
  notes: ['']
});
```

### Validaciones de Nacionalidad

```typescript
nationalityForm = this.fb.group({
  residence_start_year: [null, [
    Validators.min(1900), 
    Validators.max(new Date().getFullYear())
  ]],
  exam_ccse_score: [null, [
    Validators.min(0), 
    Validators.max(100)
  ]]
});
```

### Validación Condicional

```typescript
// Solo validar nacionalidad si matter = EXTRANJERIA
if (this.shouldShowNationalityStep() && this.nationalityForm.valid) {
  nationalityData = { ...this.nationalityForm.value };
}
```

---

## 🎯 Conceptos Clave Aprendidos

### 1. Material Stepper

**Ventajas:**
- Divide formularios complejos en pasos manejables
- Mejora UX (no abruma al usuario)
- Validación por paso
- Navegación clara

**Cuándo usar:**
- Formularios con 3+ secciones
- Datos relacionados pero independientes
- Flujo de proceso paso a paso

### 2. Formularios Anidados

**Estructura:**
```typescript
caseForm: FormGroup;           // Form principal
nationalityForm: FormGroup;    // Form anidado (condicional)
```

**Ventajas:**
- Separación de concerns
- Validación independiente
- Reutilización potencial

### 3. Record vs Array para Relaciones

**Record (usado aquí):**
```typescript
nationalities: Record<string, CaseNationality>
// Búsqueda: O(1)
// Actualización: O(1)
```

**Array:**
```typescript
nationalities: CaseNationality[]
// Búsqueda: O(n)
// Actualización: O(n)
```

**Cuándo usar cada uno:**
- Record: Cuando necesitas búsqueda rápida por clave
- Array: Cuando necesitas orden o iteración frecuente

### 4. Selectors con Parámetros

```typescript
export const selectCaseNationality = (caseId: string) =>
  createSelector(
    selectCasesState,
    (state) => state.nationalities[caseId] || null
  );
```

**Uso:**
```typescript
this.store.select(selectCaseNationality(caseId))
```

**Ventajas:**
- Reutilizable
- Memoizado
- Type-safe

---

## 🐛 Manejo de Errores

### En el Formulario

```typescript
getErrorMessage(formGroup: FormGroup, controlName: string): string {
  const control = formGroup.get(controlName);
  
  if (control?.hasError('required')) {
    return 'Este campo es obligatorio';
  }
  
  if (control?.hasError('min')) {
    return `El valor mínimo es ${control.errors?.['min'].min}`;
  }
  
  return '';
}
```

### En el Store

```typescript
on(CasesActions.loadCasesFailure, (state, { error }) => ({
  ...state,
  loading: false,
  error
}))
```

---

## 📱 Responsive Design

### Stepper en Mobile

```scss
@media (max-width: 768px) {
  .step-actions {
    flex-direction: column-reverse;
    gap: 8px;

    button {
      width: 100%;
    }
  }
}
```

---

## ✅ Checklist de Funcionalidades

- [x] Lista de casos con tabla Material
- [x] Filtros múltiples (matter, status, cliente, texto)
- [x] Formulario multi-paso con Stepper
- [x] Validaciones condicionales (EXTRANJERIA)
- [x] Formulario de nacionalidad completo
- [x] Vista de detalle de caso
- [x] Relación cliente-caso funcionando
- [x] Integración con NgRx Store
- [x] Navegación desde cliente a crear caso
- [x] Responsive design

---

## 🚀 Próximos Pasos (Fase 4)

1. **UI/UX Mejoras**
   - Header y Sidebar
   - Theming personalizado
   - Loading states mejorados
   - Toast notifications

2. **Optimizaciones**
   - Paginación en tablas
   - Virtual scrolling
   - Debounce en búsquedas

3. **Funcionalidades Adicionales**
   - Deadlines relacionados
   - Documentos del caso
   - Historial de cambios

---

## 📚 Recursos de Aprendizaje

### Documentación Oficial
- [Angular Material Stepper](https://material.angular.io/components/stepper)
- [Reactive Forms Advanced](https://angular.dev/guide/forms/reactive-forms)
- [NgRx Selectors](https://ngrx.io/guide/store/selectors)

### Conceptos Clave
- Ver `DOCUMENTACION_FASE_2.md` para Reactive Forms básicos
- Ver `DOCUMENTACION_ESTADO_ANGULAR.md` para State Management

---

**Fase 3 Completada ✅**

El sistema de casos está funcionando completamente con formulario multi-paso, relación cliente-caso, y datos de nacionalidad integrados.

