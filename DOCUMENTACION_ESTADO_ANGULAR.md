# Documentación Técnica: State Management y Context en Angular

## 📚 Índice
1. [Conceptos Fundamentales](#conceptos-fundamentales)
2. [State Management en Angular](#state-management-en-angular)
3. [NgRx: Patrón Redux para Angular](#ngrx-patrón-redux-para-angular)
4. [Context y Dependency Injection](#context-y-dependency-injection)
5. [Optimización de Carga de Datos](#optimización-de-carga-de-datos)
6. [PWA y Offline-First](#pwa-y-offline-first)
7. [Preguntas para Entrevistas Técnicas](#preguntas-para-entrevistas-técnicas)

---

## Conceptos Fundamentales

### ¿Qué es el Estado (State)?

El **estado** es toda la información que tu aplicación necesita para funcionar. En Angular, el estado puede estar en:
- **Componentes**: Variables locales (`@Input`, `@Output`, propiedades)
- **Servicios**: Datos compartidos entre componentes (singleton)
- **Store (NgRx)**: Estado global centralizado y predecible

### ¿Por qué necesitamos State Management?

**Problema sin State Management:**
```typescript
// ❌ Problema: Prop drilling (pasar datos por múltiples componentes)
ComponentA → ComponentB → ComponentC → ComponentD
// Si ComponentD necesita datos de ComponentA, hay que pasar por B y C
```

**Solución con NgRx:**
```typescript
// ✅ Solución: Store centralizado
ComponentA → Store ← ComponentD
// Ambos acceden directamente al store
```

**Beneficios:**
1. **Predecibilidad**: El estado cambia de forma predecible (actions → reducer)
2. **Debugging**: Redux DevTools permite ver cada cambio de estado
3. **Testabilidad**: Fácil testear reducers y effects
4. **Escalabilidad**: Maneja aplicaciones grandes sin prop drilling
5. **Time-travel debugging**: Puedes "viajar en el tiempo" del estado

---

## State Management en Angular

### 1. Estado Local (Component State)

**Cuándo usar:**
- Datos que solo necesita un componente
- Formularios simples
- UI state (loading, error)

**Ejemplo:**
```typescript
@Component({
  selector: 'app-client-form',
  template: `
    <form [formGroup]="form">
      <input formControlName="firstName" />
    </form>
  `
})
export class ClientFormComponent {
  form = this.fb.group({
    firstName: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) {}
}
```

### 2. Estado Compartido (Service State)

**Cuándo usar:**
- Datos compartidos entre pocos componentes relacionados
- Cache simple
- Estado de sesión

**Ejemplo:**
```typescript
@Injectable({ providedIn: 'root' })
export class ClientsService {
  private clientsSubject = new BehaviorSubject<Client[]>([]);
  clients$ = this.clientsSubject.asObservable();

  loadClients(): void {
    // Lógica de carga
    this.clientsSubject.next(clients);
  }
}
```

### 3. Estado Global (NgRx Store)

**Cuándo usar:**
- Datos compartidos entre múltiples features
- Estado complejo con múltiples fuentes
- Necesitas time-travel debugging
- Aplicaciones grandes (>10 componentes)

**Ejemplo:**
```typescript
// Store structure
{
  clients: {
    items: Client[],
    loading: boolean,
    error: string | null,
    selectedClientId: string | null
  },
  cases: {
    items: Case[],
    loading: boolean
  }
}
```

---

## NgRx: Patrón Redux para Angular

### Arquitectura NgRx

```
┌─────────────┐
│  Component  │
└──────┬──────┘
       │ dispatch(action)
       ▼
┌─────────────┐
│   Actions   │ ← Define qué pasó (eventos)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Effects   │ ← Side effects (API calls)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Reducer   │ ← Define cómo cambia el estado
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Store    │ ← Estado global (single source of truth)
└──────┬──────┘
       │ select(state)
       ▼
┌─────────────┐
│  Component  │ ← Recibe datos actualizados
└─────────────┘
```

### 1. Actions (Acciones)

**¿Qué son?**
Eventos que describen algo que pasó en la aplicación. Son objetos planos con `type` y opcionalmente `payload`.

**Ejemplo:**
```typescript
// clients.actions.ts
import { createAction, props } from '@ngrx/store';
import { Client } from '../models/client';

// Action creators usando createAction (recomendado)
export const loadClients = createAction('[Clients] Load Clients');

export const loadClientsSuccess = createAction(
  '[Clients] Load Clients Success',
  props<{ clients: Client[] }>()
);

export const loadClientsFailure = createAction(
  '[Clients] Load Clients Failure',
  props<{ error: string }>()
);

export const addClient = createAction(
  '[Clients] Add Client',
  props<{ client: Client }>()
);

export const selectClient = createAction(
  '[Clients] Select Client',
  props<{ clientId: string }>()
);
```

**Por qué usar `createAction`:**
- Type-safe (TypeScript infiere tipos)
- Menos código boilerplate
- Mejor autocompletado

### 2. Reducer (Reductor)

**¿Qué es?**
Una función pura que toma el estado actual y una acción, y retorna el nuevo estado. **NO debe tener side effects**.

**Características:**
- Función pura (mismo input → mismo output)
- Inmutable (no modifica el estado, crea uno nuevo)
- Sincrónica

**Ejemplo:**
```typescript
// clients.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { Client } from '../models/client';
import * as ClientsActions from './clients.actions';

export interface ClientsState {
  items: Client[];
  loading: boolean;
  error: string | null;
  selectedClientId: string | null;
}

export const initialState: ClientsState = {
  items: [],
  loading: false,
  error: null,
  selectedClientId: null
};

export const clientsReducer = createReducer(
  initialState,
  // Cuando se dispara loadClients
  on(ClientsActions.loadClients, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  // Cuando se completa con éxito
  on(ClientsActions.loadClientsSuccess, (state, { clients }) => ({
    ...state,
    items: clients,
    loading: false,
    error: null
  })),
  // Cuando falla
  on(ClientsActions.loadClientsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Agregar cliente
  on(ClientsActions.addClient, (state, { client }) => ({
    ...state,
    items: [...state.items, client] // Inmutable: nuevo array
  })),
  // Seleccionar cliente
  on(ClientsActions.selectClient, (state, { clientId }) => ({
    ...state,
    selectedClientId: clientId
  }))
);
```

**Inmutabilidad:**
```typescript
// ❌ MAL: Mutar el estado
state.items.push(client); // Modifica el array original

// ✅ BIEN: Crear nuevo array
{ ...state, items: [...state.items, client] }
```

### 3. Effects (Efectos)

**¿Qué son?**
Efectos secundarios (side effects) como llamadas HTTP, localStorage, etc. Se ejecutan cuando se dispara una acción.

**Características:**
- Maneja operaciones asíncronas
- Escucha acciones
- Puede disparar nuevas acciones

**Ejemplo:**
```typescript
// clients.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ClientsService } from './clients.service';
import * as ClientsActions from './clients.actions';

@Injectable()
export class ClientsEffects {
  // Effect que escucha loadClients
  loadClients$ = createEffect(() =>
    this.actions$.pipe(
      // Escucha solo la acción loadClients
      ofType(ClientsActions.loadClients),
      // Cancela la petición anterior si llega una nueva
      switchMap(() =>
        this.clientsService.getClients().pipe(
          // Si tiene éxito, dispara loadClientsSuccess
          map((clients) => ClientsActions.loadClientsSuccess({ clients })),
          // Si falla, dispara loadClientsFailure
          catchError((error) =>
            of(ClientsActions.loadClientsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private clientsService: ClientsService
  ) {}
}
```

**Operadores RxJS importantes:**
- `switchMap`: Cancela la petición anterior si llega una nueva
- `mergeMap`: Permite múltiples peticiones simultáneas
- `exhaustMap`: Ignora nuevas peticiones hasta que termine la actual
- `catchError`: Maneja errores

### 4. Selectors (Selectores)

**¿Qué son?**
Funciones que extraen datos del store de forma eficiente. Pueden ser memoizados (cached) para mejor performance.

**Ejemplo:**
```typescript
// clients.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClientsState } from './clients.reducer';

// Selector del feature
export const selectClientsState = createFeatureSelector<ClientsState>('clients');

// Selector simple
export const selectAllClients = createSelector(
  selectClientsState,
  (state) => state.items
);

// Selector con lógica
export const selectClientsLoading = createSelector(
  selectClientsState,
  (state) => state.loading
);

// Selector combinado
export const selectSelectedClient = createSelector(
  selectAllClients,
  selectClientsState,
  (clients, state) => 
    clients.find(client => client.id === state.selectedClientId)
);

// Selector con parámetros (usando función)
export const selectClientById = (clientId: string) =>
  createSelector(
    selectAllClients,
    (clients) => clients.find(client => client.id === clientId)
  );
```

**Uso en componentes:**
```typescript
@Component({...})
export class ClientListComponent {
  clients$ = this.store.select(selectAllClients);
  loading$ = this.store.select(selectClientsLoading);

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(ClientsActions.loadClients());
  }
}
```

---

## Context y Dependency Injection

### Dependency Injection (DI) en Angular

Angular usa un sistema de **Inyección de Dependencias** basado en árboles de inyectores.

**Jerarquía de Inyectores:**
```
Root Injector (AppModule)
  └── Feature Module Injector
      └── Component Injector
          └── Child Component Injector
```

### Tipos de Providers

**1. Root Level (`providedIn: 'root'`):**
```typescript
@Injectable({ providedIn: 'root' })
export class ClientsService {
  // Singleton en toda la app
}
```

**2. Module Level:**
```typescript
@NgModule({
  providers: [ClientsService]
})
export class ClientsModule {}
```

**3. Component Level:**
```typescript
@Component({
  providers: [ClientsService]
})
export class ClientFormComponent {
  // Nueva instancia por componente
}
```

### Context Pattern (Angular 14+)

Angular introdujo el concepto de **Context** con `inject()` y `Injector`.

**Ejemplo tradicional:**
```typescript
@Component({...})
export class ClientListComponent {
  constructor(
    private clientsService: ClientsService,
    private router: Router
  ) {}
}
```

**Ejemplo con inject():**
```typescript
@Component({...})
export class ClientListComponent {
  private clientsService = inject(ClientsService);
  private router = inject(Router);
}
```

**Ventajas:**
- Más fácil de testear (puedes mockear fácilmente)
- Mejor para composición
- Funciona en funciones (no solo clases)

---

## Optimización de Carga de Datos

### 1. Lazy Loading

**¿Qué es?**
Cargar módulos solo cuando se necesitan, reduciendo el bundle inicial.

**Ejemplo:**
```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'clients',
    loadChildren: () => import('./features/clients/clients.module')
      .then(m => m.ClientsModule)
  }
];
```

### 2. OnPush Change Detection

**¿Qué es?**
Estrategia de detección de cambios que solo verifica cuando:
- Inputs cambian
- Eventos del componente
- Observables con async pipe

**Ejemplo:**
```typescript
@Component({
  selector: 'app-client-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngFor="let client of clients$ | async">
      {{ client.firstName }}
    </div>
  `
})
export class ClientListComponent {
  clients$ = this.store.select(selectAllClients);
}
```

**Beneficios:**
- Mejor performance (menos checks)
- Menos re-renders innecesarios

### 3. Memoización con Selectors

Los selectors de NgRx son memoizados por defecto:
```typescript
// Solo recalcula si clients cambia
export const selectClientCount = createSelector(
  selectAllClients,
  (clients) => clients.length
);
```

### 4. Paginación y Virtual Scrolling

**Para listas grandes:**
```typescript
// clients.reducer.ts
export interface ClientsState {
  items: Client[];
  page: number;
  pageSize: number;
  total: number;
}

// Component
@Component({...})
export class ClientListComponent {
  displayedColumns = ['firstName', 'lastName'];
  dataSource = new MatTableDataSource<Client>();

  ngOnInit() {
    this.store.select(selectAllClients).subscribe(clients => {
      this.dataSource.data = clients;
    });
  }
}
```

### 5. Preloading Strategy

**Precargar rutas:**
```typescript
// app.config.ts
import { PreloadAllModules } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ]
};
```

---

## PWA y Offline-First

### Service Worker

**¿Qué es?**
Un script que corre en background, permitiendo:
- Cache de assets
- Cache de API responses
- Funcionalidad offline

### Estrategias de Cache

**1. Cache First (Assets):**
```typescript
// ngsw-config.json
{
  "assetGroups": [{
    "name": "app",
    "installMode": "prefetch",
    "resources": {
      "files": ["/favicon.ico", "/index.html", "/*.css", "/*.js"]
    }
  }]
}
```

**2. Network First (API):**
```typescript
{
  "dataGroups": [{
    "name": "api-cache",
    "urls": ["/api/**"],
    "cacheConfig": {
      "strategy": "freshness",
      "maxAge": "1h",
      "timeout": "5s"
    }
  }]
}
```

**3. Cache with Network Fallback:**
```typescript
// Para datos críticos offline
{
  "dataGroups": [{
    "name": "clients-cache",
    "urls": ["/api/clients"],
    "cacheConfig": {
      "strategy": "performance",
      "maxSize": 100,
      "maxAge": "1d"
    }
  }]
}
```

### IndexedDB con NgRx

Para datos complejos offline, usar IndexedDB:

```typescript
// clients.effects.ts
import { IndexedDBService } from './indexeddb.service';

saveClientToIndexedDB$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ClientsActions.addClient),
    tap(({ client }) => {
      this.indexedDBService.add('clients', client);
    })
  ),
  { dispatch: false } // No dispara nueva acción
);
```

---

## Preguntas para Entrevistas Técnicas

### 1. ¿Por qué usar NgRx en lugar de servicios simples?

**Respuesta:**
"NgRx proporciona un patrón predecible para manejar estado complejo. Con servicios simples, el estado puede estar disperso y es difícil rastrear cambios. NgRx ofrece:
- Single source of truth
- Time-travel debugging
- Mejor testabilidad
- Escalabilidad para aplicaciones grandes"

### 2. ¿Cuándo NO usar NgRx?

**Respuesta:**
"NgRx añade complejidad, así que no lo usaría para:
- Aplicaciones pequeñas (<5 componentes)
- Estado simple que solo necesita un componente
- Prototipos rápidos

Prefiero servicios simples para casos simples y NgRx para estado complejo compartido."

### 3. ¿Cómo optimizas el rendimiento en Angular?

**Respuesta:**
"Varias estrategias:
1. **OnPush Change Detection**: Reduce checks innecesarios
2. **Lazy Loading**: Carga módulos bajo demanda
3. **Memoización con Selectors**: Evita recálculos innecesarios
4. **TrackBy en *ngFor**: Evita re-render completo de listas
5. **Virtual Scrolling**: Para listas grandes
6. **Preloading**: Precarga rutas probables"

### 4. ¿Cómo funciona el Change Detection?

**Respuesta:**
"Angular tiene dos estrategias:
- **Default**: Verifica todos los componentes en cada ciclo
- **OnPush**: Solo verifica cuando:
  - Inputs cambian (referencia)
  - Eventos del componente
  - Observables con async pipe emiten

OnPush mejora performance porque reduce checks innecesarios."

### 5. ¿Qué es un Effect y cuándo lo usas?

**Respuesta:**
"Un Effect maneja side effects (HTTP, localStorage, etc.) de forma reactiva. Lo uso cuando:
- Necesito hacer llamadas HTTP después de una acción
- Quiero sincronizar con APIs externas
- Necesito lógica asíncrona basada en acciones

Los effects escuchan acciones y pueden disparar nuevas acciones, manteniendo el reducer puro."

### 6. ¿Cómo manejas errores en NgRx?

**Respuesta:**
"Uso el patrón de acciones de éxito/fallo:
1. Action inicial (ej: `loadClients`)
2. Effect hace la llamada HTTP
3. Si éxito: `loadClientsSuccess` con datos
4. Si fallo: `loadClientsFailure` con error

El reducer maneja ambos casos, y los componentes pueden subscribirse al estado de error."

### 7. ¿Qué es la inmutabilidad y por qué es importante?

**Respuesta:**
"Inmutabilidad significa no modificar objetos existentes, sino crear nuevos. Es importante porque:
- Permite comparación por referencia (más rápido)
- Evita bugs por mutaciones inesperadas
- Habilita time-travel debugging
- Facilita testing

En NgRx, siempre retorno nuevos objetos: `{ ...state, items: [...state.items, newItem] }`"

### 8. ¿Cómo estructuras una aplicación Angular grande?

**Respuesta:**
"Uso Feature Modules con lazy loading:
- **Core Module**: Servicios singleton (auth, http)
- **Shared Module**: Componentes reutilizables
- **Feature Modules**: Cada feature es un módulo independiente
- **Store**: Organizado por feature (clients/, cases/)

Cada feature tiene su propio módulo, routing, store, y puede cargarse bajo demanda."

---

## Resumen Ejecutivo

### Conceptos Clave

1. **State Management**: NgRx para estado complejo, servicios para estado simple
2. **Actions**: Eventos que describen qué pasó
3. **Reducers**: Funciones puras que definen cómo cambia el estado
4. **Effects**: Manejan side effects (HTTP, etc.)
5. **Selectors**: Extraen datos del store eficientemente
6. **DI**: Angular inyecta dependencias automáticamente
7. **OnPush**: Optimiza change detection
8. **Lazy Loading**: Mejora performance inicial
9. **PWA**: Service Worker para funcionalidad offline

### Mejores Prácticas

✅ Usa NgRx para estado compartido complejo
✅ Mantén reducers puros (sin side effects)
✅ Usa selectors memoizados
✅ Implementa OnPush cuando sea posible
✅ Lazy load feature modules
✅ Maneja errores con acciones de fallo
✅ Mantén inmutabilidad en el estado
✅ Documenta decisiones arquitectónicas

---

**Próximos pasos**: Implementar esta arquitectura en el proyecto Made Legal.

