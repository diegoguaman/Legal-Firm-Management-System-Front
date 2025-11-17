# Documentación Fase 2: CRUD de Clientes

## 📋 Resumen

La Fase 2 implementa un CRUD completo de clientes con:
- ✅ Lista de clientes con tabla Material
- ✅ Formulario reactivo para crear/editar clientes
- ✅ Integración completa con NgRx Store
- ✅ Datos mock funcionando
- ✅ UI responsive con Angular Material

---

## 🏗️ Arquitectura Implementada

### Estructura de Archivos

```
src/app/features/clients/
├── client-list/
│   ├── client-list.component.ts
│   ├── client-list.component.html
│   └── client-list.component.scss
├── client-form/
│   ├── client-form.component.ts
│   ├── client-form.component.html
│   └── client-form.component.scss
└── clients.routes.ts
```

### Flujo de Datos Completo

```
┌─────────────────┐
│   Component     │
│  (User Action)  │
└────────┬────────┘
         │ dispatch(action)
         ▼
┌─────────────────┐
│     Action      │
│  loadClients()  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Effect      │
│  loadClients$   │
└────────┬────────┘
         │ switchMap()
         ▼
┌─────────────────┐
│    Service      │
│ ClientsService  │
│  getClients()   │
└────────┬────────┘
         │ Observable<Client[]>
         │ (mock data con delay)
         ▼
┌─────────────────┐
│     Action      │
│loadClientsSuccess│
└────────┬────────┘
         │ dispatch()
         ▼
┌─────────────────┐
│    Reducer      │
│ clientsReducer  │
└────────┬────────┘
         │ new state
         ▼
┌─────────────────┐
│     Store       │
│  AppState       │
└────────┬────────┘
         │ select()
         ▼
┌─────────────────┐
│    Selector     │
│selectAllClients │
└────────┬────────┘
         │ Observable<Client[]>
         ▼
┌─────────────────┐
│   Component     │
│  Template       │
│  *ngFor         │
└─────────────────┘
```

---

## 📦 Componentes Detallados

### 1. ClientListComponent

#### Responsabilidades
- Mostrar lista de clientes en tabla
- Filtrar clientes por búsqueda
- Navegar a formulario de creación/edición
- Eliminar clientes
- Mostrar estados de loading y error

#### Código Clave

```typescript
// Inyección de dependencias con inject()
private store = inject(Store<AppState>);

// Observables del store
clients$: Observable<Client[]> = this.store.select(selectAllClients);
loading$: Observable<boolean> = this.store.select(selectClientsLoading);
error$: Observable<string | null> = this.store.select(selectClientsError);

// Cargar datos al inicializar
ngOnInit(): void {
  this.store.dispatch(loadClients());
}
```

#### Conceptos Importantes

**1. OnPush Change Detection**
```typescript
changeDetection: ChangeDetectionStrategy.OnPush
```
- Solo verifica cambios cuando:
  - Inputs cambian (referencia)
  - Eventos del componente
  - Observables con async pipe emiten
- Mejora performance significativamente

**2. Async Pipe**
```html
<div *ngIf="loading$ | async">
```
- Se subscribe automáticamente
- Se desuscribe automáticamente
- Maneja null/undefined
- Evita memory leaks

**3. Null Safety en Template**
```html
<table mat-table [dataSource]="(clients$ | async) || []">
```
- `|| []` proporciona array vacío si es null
- Evita errores de tipo en MatTable

#### Acciones Disparadas

```typescript
// Cargar clientes
this.store.dispatch(loadClients());

// Seleccionar cliente (para edición)
this.store.dispatch(selectClient({ clientId }));

// Eliminar cliente
this.store.dispatch(deleteClient({ clientId }));
```

---

### 2. ClientFormComponent

#### Responsabilidades
- Crear nuevos clientes
- Editar clientes existentes
- Validar formulario
- Manejar estados de loading
- Navegar después de guardar

#### Código Clave

```typescript
// Reactive Form
clientForm!: FormGroup;

// Inicialización del formulario
private initializeForm(): void {
  this.clientForm = this.fb.group({
    dni_nie_hash: ['', [Validators.required, Validators.minLength(3)]],
    first_name: ['', [Validators.required, Validators.minLength(2)]],
    // ... más campos
  });
}

// Detectar modo edición
private checkEditMode(): void {
  this.clientId = this.route.snapshot.paramMap.get('id');
  if (this.clientId) {
    this.isEditMode = true;
    this.loadClientData();
  }
}
```

#### Conceptos Importantes

**1. Reactive Forms**
- `FormBuilder`: Crea formularios de forma declarativa
- `FormGroup`: Agrupa controles
- `Validators`: Validaciones síncronas
- `FormControl`: Control individual

**2. Validaciones**
```typescript
dni_nie_hash: ['', [Validators.required, Validators.minLength(3)]]
```
- `required`: Campo obligatorio
- `minLength(3)`: Mínimo 3 caracteres
- `pattern`: Expresión regular (ej: código postal)

**3. Cargar Datos para Edición**
```typescript
// 1. Cargar clientes al store
this.store.dispatch(loadClients());

// 2. Obtener cliente específico
this.store.select(selectClientById(this.clientId))
  .pipe(take(1)) // Tomar solo el primer valor y completar
  .subscribe(client => {
    if (client) {
      this.clientForm.patchValue({...}); // Actualizar formulario
    }
  });
```

**4. take(1) Operator**
- Toma solo el primer valor del observable
- Se completa automáticamente
- Evita suscripciones persistentes
- Útil para operaciones one-time

#### Flujo de Submit

```typescript
onSubmit(): void {
  // 1. Validar formulario
  if (this.clientForm.invalid) {
    // Marcar campos como touched para mostrar errores
    return;
  }

  // 2. Preparar datos
  const clientData: Partial<Client> = {
    ...this.clientForm.value,
    id: this.clientId || this.generateId(),
    updated_at: new Date().toISOString()
  };

  // 3. Disparar acción
  if (this.isEditMode) {
    this.store.dispatch(updateClient({ client: clientData as Client }));
  } else {
    this.store.dispatch(addClient({ client: clientData as Client }));
  }

  // 4. Navegar después de delay
  setTimeout(() => {
    this.router.navigate(['/clients']);
  }, 500);
}
```

---

## 🔄 Integración con NgRx

### Actions Utilizadas

```typescript
// Cargar
loadClients()                    // Inicia carga
loadClientsSuccess({ clients })  // Éxito
loadClientsFailure({ error })    // Error

// Crear
addClient({ client })            // Inicia creación
addClientSuccess({ client })     // Éxito
addClientFailure({ error })      // Error

// Actualizar
updateClient({ client })         // Inicia actualización
updateClientSuccess({ client })  // Éxito
updateClientFailure({ error })   // Error

// Eliminar
deleteClient({ clientId })       // Inicia eliminación
deleteClientSuccess({ clientId }) // Éxito
deleteClientFailure({ error })    // Error

// Seleccionar
selectClient({ clientId })       // Selecciona cliente
```

### Reducer - Cómo Cambia el Estado

```typescript
// Estado inicial
{
  items: [],
  loading: false,
  error: null,
  selectedClientId: null
}

// Después de loadClients()
{
  items: [],
  loading: true,  // ← Cambia
  error: null,
  selectedClientId: null
}

// Después de loadClientsSuccess({ clients: [...] })
{
  items: [...],   // ← Datos cargados
  loading: false, // ← Ya no está cargando
  error: null,
  selectedClientId: null
}

// Después de addClientSuccess({ client: {...} })
{
  items: [...state.items, newClient], // ← Nuevo cliente agregado
  loading: false,
  error: null,
  selectedClientId: null
}
```

**Importante: Inmutabilidad**
- Siempre crear nuevos objetos
- Usar spread operator: `{ ...state, items: [...state.items, newItem] }`
- Nunca mutar directamente: `state.items.push(newItem)` ❌

### Effects - Side Effects

```typescript
loadClients$ = createEffect(() =>
  this.actions$.pipe(
    // 1. Escuchar solo loadClients
    ofType(ClientsActions.loadClients),
    
    // 2. Cancelar petición anterior si llega nueva
    switchMap(() =>
      // 3. Llamar servicio
      this.clientsService.getClients().pipe(
        // 4. Si éxito, disparar success
        map((clients) => ClientsActions.loadClientsSuccess({ clients })),
        // 5. Si error, disparar failure
        catchError((error) =>
          of(ClientsActions.loadClientsFailure({ error: error.message }))
        )
      )
    )
  )
);
```

**Operadores RxJS Explicados:**

- `ofType`: Filtra acciones específicas
- `switchMap`: Cancela petición anterior si llega nueva
- `map`: Transforma el valor
- `catchError`: Maneja errores
- `of`: Crea observable con valor

### Selectors - Extracción de Datos

```typescript
// Selector simple
export const selectAllClients = createSelector(
  selectClientsState,
  (state: ClientsState) => state.items
);

// Selector con parámetros
export const selectClientById = (clientId: string) =>
  createSelector(
    selectAllClients,
    (clients: Client[]) => clients.find(client => client.id === clientId) || null
  );
```

**Memoización:**
- Los selectors son memoizados por defecto
- Solo recalculan si el input cambia
- Mejora performance significativamente

---

## 🎨 Angular Material

### Componentes Utilizados

**1. MatTable**
```html
<table mat-table [dataSource]="clients">
  <ng-container matColumnDef="first_name">
    <th mat-header-cell *matHeaderCellDef>Nombre</th>
    <td mat-cell *matCellDef="let client">{{ client.first_name }}</td>
  </ng-container>
</table>
```

**2. MatFormField**
```html
<mat-form-field appearance="outline">
  <mat-label>Nombre</mat-label>
  <input matInput formControlName="first_name">
  <mat-error *ngIf="hasError('first_name')">
    {{ getErrorMessage('first_name') }}
  </mat-error>
</mat-form-field>
```

**3. MatButton**
```html
<button mat-raised-button color="primary">
  <mat-icon>add</mat-icon>
  Nuevo Cliente
</button>
```

**4. MatCard**
```html
<mat-card>
  <mat-card-header>
    <mat-card-title>Lista de Clientes</mat-card-title>
  </mat-card-header>
  <mat-card-content>
    <!-- Contenido -->
  </mat-card-content>
</mat-card>
```

---

## 🛣️ Routing

### Configuración de Rutas

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/clients',
    pathMatch: 'full'
  },
  {
    path: 'clients',
    loadChildren: () => import('./features/clients/clients.routes')
      .then(m => m.clientsRoutes)
  }
];

// clients.routes.ts
export const clientsRoutes: Routes = [
  { path: '', component: ClientListComponent },
  { path: 'new', component: ClientFormComponent },
  { path: ':id/edit', component: ClientFormComponent }
];
```

**Lazy Loading:**
- `loadChildren`: Carga el módulo bajo demanda
- Reduce bundle size inicial
- Mejora tiempo de carga

**Rutas:**
- `/clients` → Lista
- `/clients/new` → Crear
- `/clients/:id/edit` → Editar

---

## 🎯 Conceptos Clave Aprendidos

### 1. Reactive Forms vs Template-Driven Forms

**Reactive Forms (usado aquí):**
- ✅ Más control
- ✅ Mejor para formularios complejos
- ✅ Más fácil de testear
- ✅ Validaciones programáticas

**Template-Driven Forms:**
- Más simple para formularios básicos
- Menos código TypeScript
- Validaciones en template

### 2. Change Detection Strategies

**Default:**
- Verifica todos los componentes en cada ciclo
- Más checks innecesarios

**OnPush:**
- Solo verifica cuando inputs cambian o eventos ocurren
- Mejor performance
- Requiere inmutabilidad

### 3. Async Pipe vs Subscribe

**Async Pipe (recomendado):**
```html
<div *ngIf="clients$ | async">
```
- ✅ Se desuscribe automáticamente
- ✅ Maneja null/undefined
- ✅ Menos código

**Subscribe (manual):**
```typescript
this.clients$.subscribe(clients => {
  this.clients = clients;
});
```
- ❌ Requiere unsubscribe manual
- ❌ Más código
- ❌ Puede causar memory leaks

### 4. RxJS Operators

**switchMap:**
- Cancela petición anterior si llega nueva
- Útil para búsquedas

**mergeMap:**
- Permite múltiples peticiones simultáneas
- Útil cuando quieres todas las respuestas

**exhaustMap:**
- Ignora nuevas peticiones hasta que termine la actual
- Útil para prevenir múltiples submits

**take(1):**
- Toma solo el primer valor
- Se completa automáticamente
- Útil para operaciones one-time

---

## 🐛 Manejo de Errores

### En Effects

```typescript
catchError((error) =>
  of(ClientsActions.loadClientsFailure({ error: error.message }))
)
```

### En Componentes

```html
<div *ngIf="error$ | async as error" class="error-container">
  <p class="error-message">Error: {{ error }}</p>
</div>
```

### En Formularios

```typescript
getErrorMessage(controlName: string): string {
  const control = this.clientForm.get(controlName);
  
  if (control?.hasError('required')) {
    return 'Este campo es obligatorio';
  }
  
  if (control?.hasError('minlength')) {
    const requiredLength = control.errors?.['minlength'].requiredLength;
    return `Mínimo ${requiredLength} caracteres`;
  }
  
  return '';
}
```

---

## 📱 Responsive Design

### Breakpoints

```scss
@media (max-width: 768px) {
  .client-list-container {
    padding: 16px;
  }

  .actions-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-field {
    width: 100%;
  }
}
```

### Material Breakpoints

- `xs`: < 600px
- `sm`: ≥ 600px
- `md`: ≥ 960px
- `lg`: ≥ 1280px
- `xl`: ≥ 1920px

---

## ✅ Checklist de Funcionalidades

- [x] Lista de clientes con tabla Material
- [x] Búsqueda/filtro de clientes
- [x] Crear nuevo cliente
- [x] Editar cliente existente
- [x] Eliminar cliente
- [x] Validaciones de formulario
- [x] Manejo de errores
- [x] Estados de loading
- [x] Navegación entre vistas
- [x] Responsive design
- [x] Integración con NgRx Store

---

## 🚀 Próximos Pasos (Fase 3)

1. **Casos y Nacionalidad**
   - Formulario multi-paso (Stepper)
   - Relación cliente-caso
   - Formulario de nacionalidad

2. **Mejoras de UX**
   - Confirmaciones de eliminación (dialog)
   - Toast notifications
   - Mejor manejo de estados vacíos

3. **Optimizaciones**
   - Paginación en tabla
   - Virtual scrolling para listas grandes
   - Debounce en búsqueda

---

## 📚 Recursos de Aprendizaje

### Documentación Oficial
- [Angular Reactive Forms](https://angular.dev/guide/forms/reactive-forms)
- [Angular Material Table](https://material.angular.io/components/table)
- [NgRx Effects](https://ngrx.io/guide/effects)

### Conceptos Clave
- Ver `DOCUMENTACION_ESTADO_ANGULAR.md` para State Management
- Ver `ESTRUCTURA_PROYECTO.md` para arquitectura

---

**Fase 2 Completada ✅**

El CRUD de clientes está funcionando completamente con datos mock, listo para presentar al cliente y continuar con la Fase 3.

