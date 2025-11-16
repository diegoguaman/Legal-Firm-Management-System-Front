# 📚 Documentación Técnica - Made Legal Frontend

## 🎯 Propósito de este Documento

Este documento explica las decisiones técnicas tomadas en el proyecto, los conceptos clave de Angular (Context, Estados, Store), y cómo responder a preguntas técnicas en entrevistas. Está diseñado para ayudarte a entender y explicar el código que construimos.

---

## 🏗️ Arquitectura del Proyecto

### ¿Por qué esta estructura?

**Separación de Responsabilidades (SoC - Separation of Concerns)**
- Cada módulo tiene una responsabilidad única y clara
- `core/`: Servicios globales (singleton) que se instancian una sola vez
- `shared/`: Componentes reutilizables que no tienen lógica de negocio
- `features/`: Módulos de funcionalidad específica (lazy-loaded para mejor performance)

**DRY (Don't Repeat Yourself)**
- Modelos centralizados en `models/` para evitar duplicación
- Servicios compartidos en `core/services/`
- Componentes UI reutilizables en `shared/components/`

**KISS (Keep It Simple, Stupid)**
- Estructura simple pero escalable
- Evitamos complejidad innecesaria
- Cada feature es independiente y fácil de entender

**SOLID Principles**
- Single Responsibility: Cada clase/servicio tiene una sola razón para cambiar
- Open/Closed: Abierto para extensión, cerrado para modificación
- Dependency Inversion: Dependemos de abstracciones (interfaces), no de implementaciones concretas

---

## 🔄 Context y Estados en Angular

### ¿Qué es el Context en Angular?

En Angular, el **Context** se refiere al contexto de ejecución de un componente o servicio. Angular usa un sistema de **Inyección de Dependencias (DI)** que crea un árbol de inyectores.

#### Árbol de Inyectores (Injector Tree)

```
AppModule (Root Injector)
  └── FeatureModule (Feature Injector)
      └── Component (Component Injector)
          └── ChildComponent (Child Injector)
```

**Conceptos clave:**

1. **Singleton Services**: Servicios proporcionados en `CoreModule` o `AppModule` se instancian UNA SOLA VEZ para toda la aplicación
2. **Scoped Services**: Servicios proporcionados en un componente se crean una instancia por componente
3. **Hierarchical DI**: Los componentes hijos pueden inyectar servicios de sus padres, pero no al revés

#### Ejemplo Práctico:

```typescript
// core/services/http.service.ts
@Injectable({ providedIn: 'root' }) // Singleton global
export class HttpService {
  // Una sola instancia para toda la app
}

// features/clients/clients.service.ts
@Injectable({ providedIn: 'root' }) // También singleton
export class ClientsService {
  constructor(private http: HttpService) {} // Inyecta HttpService
}

// features/clients/list/client-list.component.ts
@Component({
  selector: 'app-client-list',
  providers: [LocalService] // Nueva instancia por componente
})
export class ClientListComponent {
  constructor(
    private clientsService: ClientsService, // Misma instancia global
    private localService: LocalService      // Nueva instancia por componente
  ) {}
}
```

### ¿Qué son los Estados en Angular?

Los **Estados** representan el estado actual de la aplicación en un momento dado. En Angular, hay varias formas de manejar el estado:

#### 1. Estado Local del Componente

```typescript
@Component({
  selector: 'app-client-list',
  template: `<div>{{ clients.length }} clientes</div>`
})
export class ClientListComponent {
  clients: Client[] = []; // Estado local
  
  ngOnInit() {
    this.loadClients();
  }
  
  loadClients() {
    this.clientsService.getClients().subscribe(clients => {
      this.clients = clients; // Actualiza estado local
    });
  }
}
```

**Problemas del estado local:**
- ❌ No se comparte entre componentes
- ❌ Se pierde al navegar
- ❌ Difícil de sincronizar entre múltiples componentes
- ❌ No funciona bien con PWA/Offline

#### 2. Estado Compartido con Servicios (Sin NgRx)

```typescript
@Injectable({ providedIn: 'root' })
export class ClientsService {
  private clientsSubject = new BehaviorSubject<Client[]>([]);
  clients$ = this.clientsSubject.asObservable(); // Observable público
  
  loadClients() {
    this.http.get<Client[]>('/api/clients').subscribe(clients => {
      this.clientsSubject.next(clients); // Emite nuevo estado
    });
  }
  
  addClient(client: Client) {
    const current = this.clientsSubject.value;
    this.clientsSubject.next([...current, client]); // Inmutabilidad
  }
}
```

**Ventajas:**
- ✅ Estado compartido entre componentes
- ✅ Reactivo con Observables
- ✅ Persiste mientras el servicio existe

**Desventajas:**
- ❌ No hay historial de cambios (time-travel debugging)
- ❌ Difícil de testear
- ❌ No hay un patrón claro para efectos secundarios

#### 3. Estado Global con NgRx (Nuestra Solución)

NgRx implementa el patrón **Redux** para Angular, proporcionando:
- **Store**: Estado global inmutable
- **Actions**: Eventos que describen qué pasó
- **Reducers**: Funciones puras que calculan el nuevo estado
- **Effects**: Efectos secundarios (llamadas API, etc.)
- **Selectors**: Funciones para obtener datos del store de forma eficiente

---

## 🗄️ NgRx Store - Gestión de Estado Global

### ¿Por qué NgRx?

1. **Predecibilidad**: El estado solo cambia a través de acciones
2. **Debugging**: Redux DevTools permite ver cada acción y cambio de estado
3. **Testabilidad**: Reducers y selectors son funciones puras, fáciles de testear
4. **Escalabilidad**: Maneja aplicaciones grandes con múltiples features
5. **PWA/Offline**: Facilita sincronización y caché offline

### Arquitectura NgRx

```
Component
    ↓ dispatch(action)
Action
    ↓
Reducer (calcula nuevo estado)
    ↓
Store (estado actualizado)
    ↓ selector
Component (recibe nuevo estado)
    
Action
    ↓
Effect (llamada API)
    ↓ success/failure
Action
    ↓
Reducer
```

### Flujo Completo: Cargar Clientes

#### 1. Action (Qué pasó)

```typescript
// store/clients/clients.actions.ts
import { createAction, props } from '@ngrx/store';
import { Client } from '../../models/client';

// Acción para iniciar la carga
export const loadClients = createAction('[Clients] Load Clients');

// Acción cuando la carga es exitosa
export const loadClientsSuccess = createAction(
  '[Clients] Load Clients Success',
  props<{ clients: Client[] }>()
);

// Acción cuando hay error
export const loadClientsFailure = createAction(
  '[Clients] Load Clients Failure',
  props<{ error: string }>()
);
```

**¿Por qué separar en 3 acciones?**
- Permite manejar estados de loading, success y error
- Facilita el debugging (vemos exactamente qué pasó)
- Permite reutilizar acciones en diferentes contextos

#### 2. Reducer (Cómo cambia el estado)

```typescript
// store/clients/clients.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { Client } from '../../models/client';
import * as ClientsActions from './clients.actions';

export interface ClientsState {
  clients: Client[];
  loading: boolean;
  error: string | null;
}

export const initialState: ClientsState = {
  clients: [],
  loading: false,
  error: null
};

export const clientsReducer = createReducer(
  initialState,
  
  // Cuando se inicia la carga
  on(ClientsActions.loadClients, (state) => ({
    ...state,                    // Copia el estado anterior
    loading: true,               // Marca como cargando
    error: null                  // Limpia errores previos
  })),
  
  // Cuando la carga es exitosa
  on(ClientsActions.loadClientsSuccess, (state, { clients }) => ({
    ...state,
    clients,                     // Actualiza la lista de clientes
    loading: false,              // Ya no está cargando
    error: null
  })),
  
  // Cuando hay error
  on(ClientsActions.loadClientsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error                        // Guarda el error
  }))
);
```

**Principios del Reducer:**
- ✅ **Función pura**: No modifica el estado original, crea uno nuevo
- ✅ **Inmutabilidad**: Usa spread operator (`...state`) para crear copias
- ✅ **Predecible**: Mismo input siempre produce mismo output
- ✅ **Sin efectos secundarios**: No hace llamadas API, no modifica variables externas

#### 3. Effect (Efectos secundarios - API calls)

```typescript
// store/clients/clients.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ClientsService } from '../../features/clients/clients.service';
import * as ClientsActions from './clients.actions';

@Injectable()
export class ClientsEffects {
  
  // Effect que escucha la acción loadClients
  loadClients$ = createEffect(() =>
    this.actions$.pipe(
      // Escucha solo la acción loadClients
      ofType(ClientsActions.loadClients),
      
      // Cancela llamadas anteriores si hay una nueva
      switchMap(() =>
        // Llama al servicio
        this.clientsService.getClients().pipe(
          // Si es exitoso, despacha loadClientsSuccess
          map(clients => ClientsActions.loadClientsSuccess({ clients })),
          
          // Si hay error, despacha loadClientsFailure
          catchError(error => 
            of(ClientsActions.loadClientsFailure({ 
              error: error.message 
            }))
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

**¿Por qué Effects?**
- Separa la lógica de efectos secundarios (API, localStorage, etc.) de los componentes
- Maneja automáticamente la cancelación de llamadas (switchMap)
- Centraliza el manejo de errores
- Fácil de testear (mock del servicio)

#### 4. Selector (Obtener datos del store)

```typescript
// store/clients/clients.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClientsState } from './clients.reducer';

// Selector de la feature completa
export const selectClientsState = createFeatureSelector<ClientsState>('clients');

// Selector de la lista de clientes
export const selectAllClients = createSelector(
  selectClientsState,
  (state: ClientsState) => state.clients
);

// Selector de loading
export const selectClientsLoading = createSelector(
  selectClientsState,
  (state: ClientsState) => state.loading
);

// Selector de error
export const selectClientsError = createSelector(
  selectClientsState,
  (state: ClientsState) => state.error
);

// Selector derivado: clientes activos (no eliminados)
export const selectActiveClients = createSelector(
  selectAllClients,
  (clients) => clients.filter(client => !client.deleted_at)
);
```

**Ventajas de los Selectors:**
- ✅ **Memoización**: Solo recalcula si cambian las dependencias
- ✅ **Composición**: Puedes combinar selectors para crear nuevos
- ✅ **Performance**: Evita cálculos innecesarios
- ✅ **Type-safe**: TypeScript sabe el tipo de retorno

#### 5. Uso en Componente

```typescript
// features/clients/list/client-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Client } from '../../../models/client';
import * as ClientsActions from '../../../store/clients/clients.actions';
import * as ClientsSelectors from '../../../store/clients/clients.selectors';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html'
})
export class ClientListComponent implements OnInit {
  // Observables del store
  clients$: Observable<Client[]> = this.store.select(ClientsSelectors.selectAllClients);
  loading$: Observable<boolean> = this.store.select(ClientsSelectors.selectClientsLoading);
  error$: Observable<string | null> = this.store.select(ClientsSelectors.selectClientsError);
  
  constructor(private store: Store) {}
  
  ngOnInit(): void {
    // Despacha acción para cargar clientes
    this.store.dispatch(ClientsActions.loadClients());
  }
}
```

```html
<!-- client-list.component.html -->
<div *ngIf="loading$ | async">Cargando...</div>
<div *ngIf="error$ | async as error">{{ error }}</div>

<table *ngIf="clients$ | async as clients">
  <tr *ngFor="let client of clients">
    <td>{{ client.first_name }} {{ client.last_name }}</td>
  </tr>
</table>
```

---

## ⚡ Optimización y Performance

### ¿Por qué es importante para PWA?

En una PWA, queremos:
1. **Carga rápida**: Menos tiempo de carga inicial
2. **Caché eficiente**: Guardar datos para uso offline
3. **Sincronización**: Actualizar cuando vuelve la conexión
4. **Memoria eficiente**: No cargar datos innecesarios

### Estrategias de Optimización

#### 1. Lazy Loading de Módulos

```typescript
// app-routing.module.ts
const routes: Routes = [
  {
    path: 'clients',
    loadChildren: () => import('./features/clients/clients.module')
      .then(m => m.ClientsModule)
  },
  {
    path: 'cases',
    loadChildren: () => import('./features/cases/cases.module')
      .then(m => m.CasesModule)
  }
];
```

**Beneficio**: Solo carga el código necesario cuando el usuario navega a esa ruta.

#### 2. OnPush Change Detection

```typescript
@Component({
  selector: 'app-client-list',
  changeDetection: ChangeDetectionStrategy.OnPush, // ⚡ Optimización
  templateUrl: './client-list.component.html'
})
export class ClientListComponent {
  clients$: Observable<Client[]> = this.store.select(selectAllClients);
}
```

**Beneficio**: Angular solo verifica cambios cuando:
- Cambia una referencia del input
- Se dispara un evento en el componente
- Un observable emite un nuevo valor

#### 3. Memoización con Selectors

Los selectors de NgRx son automáticamente memoizados. Solo recalcula si cambian las dependencias.

#### 4. Caché en Service Worker

```typescript
// ngsw-config.json
{
  "dataGroups": [{
    "name": "api-cache",
    "urls": ["/api/clients", "/api/cases"],
    "cacheConfig": {
      "maxSize": 100,
      "maxAge": "1h",
      "strategy": "freshness"
    }
  }]
}
```

**Beneficio**: Los datos se guardan localmente y están disponibles offline.

---

## 🧪 Testing

### ¿Por qué 95% de cobertura?

- **Confianza**: Sabes que tu código funciona
- **Refactoring seguro**: Puedes cambiar código sin miedo
- **Documentación**: Los tests documentan cómo usar el código
- **Detección temprana**: Encuentras bugs antes de producción

### Estrategia de Testing

1. **Unit Tests**: Servicios, reducers, selectors (95% cobertura)
2. **Component Tests**: Componentes aislados con mocks
3. **E2E Tests**: Flujos completos del usuario (80% cobertura)

---

## 💼 Preguntas Técnicas Comunes en Entrevistas

### 1. "¿Por qué elegiste NgRx en lugar de servicios simples?"

**Respuesta:**
"Elegimos NgRx porque necesitamos:
- **Estado global compartido** entre múltiples features
- **Time-travel debugging** para facilitar el desarrollo
- **Predecibilidad** del estado (solo cambia a través de acciones)
- **Escalabilidad** para cuando la app crezca
- **Sincronización offline** para la PWA (NgRx facilita guardar/restaurar estado)

Para una app pequeña, servicios con BehaviorSubject serían suficientes, pero para un MVP que crecerá, NgRx nos da una base sólida."

### 2. "¿Cómo manejas la carga de datos eficiente?"

**Respuesta:**
"Usamos varias estrategias:
1. **Lazy loading** de módulos para cargar código solo cuando se necesita
2. **Selectors memoizados** de NgRx que solo recalculan cuando cambian las dependencias
3. **OnPush change detection** para reducir verificaciones innecesarias
4. **Service Worker** para cachear respuestas API y servir datos offline
5. **Paginación** en tablas grandes para no cargar todos los datos a la vez"

### 3. "¿Cómo funciona el Context en Angular?"

**Respuesta:**
"Angular usa un árbol de inyectores jerárquico:
- Los servicios con `providedIn: 'root'` son singletons globales
- Los servicios en `providers` de un componente crean una nueva instancia por componente
- Los componentes hijos pueden inyectar servicios de sus padres, pero no al revés
- Esto permite compartir estado a través de servicios singleton o tener estado local por componente según necesitemos"

### 4. "¿Qué es la inmutabilidad y por qué es importante?"

**Respuesta:**
"La inmutabilidad significa no modificar objetos existentes, sino crear nuevos. En NgRx:
- Los reducers crean nuevos objetos en lugar de mutar los existentes
- Esto permite:
  - **Comparación por referencia** (más rápido que deep comparison)
  - **Time-travel debugging** (podemos volver a estados anteriores)
  - **Detección de cambios** eficiente en Angular
  - **Thread safety** (importante para futuras optimizaciones)

Ejemplo: En lugar de `state.clients.push(newClient)`, hacemos `{ ...state, clients: [...state.clients, newClient] }`"

### 5. "¿Cómo manejas errores en NgRx?"

**Respuesta:**
"Usamos un patrón consistente:
1. **Actions de error** para cada operación (loadClientsFailure, createClientFailure)
2. **Effects** que capturan errores con `catchError` y despachan acciones de error
3. **Estado de error** en el reducer para mostrar mensajes al usuario
4. **Selectors** para obtener el estado de error en componentes
5. **Global error handler** para errores inesperados

Esto centraliza el manejo de errores y facilita mostrar mensajes consistentes al usuario."

---

## 📝 Próximos Pasos

1. ✅ Configurar proyecto Angular
2. ✅ Crear estructura de carpetas
3. ✅ Implementar modelos TypeScript
4. ✅ Configurar NgRx Store
5. ✅ Implementar CRUD de Clientes
6. ✅ Implementar formulario de Caso de Nacionalidad

---

**Última actualización**: 2025-01-XX
**Autor**: Documentación técnica para Made Legal Frontend

