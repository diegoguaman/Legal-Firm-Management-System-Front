# Estructura del Proyecto Made Legal Frontend

## 📁 Organización de Carpetas

```
src/app/
├── core/                      # Servicios y configuraciones globales
│   └── services/
│       └── clients.service.ts # Servicio para operaciones CRUD de clientes
├── shared/                    # Componentes y utilidades reutilizables
│   ├── components/           # Componentes UI compartidos (futuro)
│   └── pipes/                # Pipes personalizados (futuro)
├── features/                 # Módulos de funcionalidad (lazy-loaded)
│   ├── dashboard/            # Dashboard principal (futuro)
│   ├── clients/              # Feature de clientes (futuro)
│   └── cases/                # Feature de casos (futuro)
├── models/                   # Interfaces TypeScript
│   ├── client.interface.ts
│   ├── case.interface.ts
│   ├── case-nationality.interface.ts
│   └── index.ts              # Barrel export
├── data/                     # Datos mock para desarrollo
│   └── mock-data.ts
├── store/                    # NgRx State Management
│   ├── app.state.ts          # Estado global de la aplicación
│   ├── index.ts              # Barrel export
│   └── clients/              # Store del feature de clientes
│       ├── clients.actions.ts    # Acciones NgRx
│       ├── clients.reducer.ts    # Reducer (lógica de estado)
│       ├── clients.effects.ts    # Effects (side effects)
│       └── clients.selectors.ts  # Selectors (extracción de datos)
├── app.config.ts             # Configuración de la aplicación
├── app.routes.ts             # Rutas de la aplicación
└── app.ts                    # Componente raíz
```

---

## 🎯 Principios de Organización

### 1. **Separation of Concerns (SoC)**
Cada carpeta tiene una responsabilidad específica:
- `core/`: Servicios singleton y configuraciones globales
- `shared/`: Componentes y utilidades reutilizables
- `features/`: Módulos independientes por funcionalidad
- `models/`: Definiciones de tipos e interfaces
- `store/`: Gestión de estado global

### 2. **DRY (Don't Repeat Yourself)**
- Interfaces compartidas en `models/`
- Componentes reutilizables en `shared/`
- Servicios compartidos en `core/`

### 3. **KISS (Keep It Simple, Stupid)**
- Estructura simple pero escalable
- Evitar sobre-ingeniería
- Agregar complejidad solo cuando sea necesario

### 4. **Feature Modules**
Cada feature es independiente y puede cargarse bajo demanda (lazy loading):
- Tiene su propio routing
- Tiene su propio store slice
- Puede desarrollarse y testearse independientemente

---

## 📦 Descripción de Carpetas

### `/core`
**Propósito**: Servicios y configuraciones que se usan en toda la aplicación.

**Características**:
- Servicios singleton (`providedIn: 'root'`)
- Configuraciones globales
- Interceptors, guards (futuro)

**Ejemplo**:
```typescript
// core/services/clients.service.ts
@Injectable({ providedIn: 'root' })
export class ClientsService {
  // Servicio disponible en toda la app
}
```

### `/shared`
**Propósito**: Componentes, pipes, y directivas reutilizables.

**Características**:
- Componentes UI comunes (header, sidebar, loading spinner)
- Pipes de transformación (date, currency)
- Directivas personalizadas

**Uso**: Importar en módulos que los necesiten.

### `/features`
**Propósito**: Módulos de funcionalidad independientes.

**Estructura típica**:
```
features/clients/
├── components/
│   ├── client-list/
│   └── client-form/
├── clients.routes.ts
└── clients.module.ts (si no es standalone)
```

**Características**:
- Cada feature es un módulo independiente
- Lazy-loaded (carga bajo demanda)
- Tiene su propio routing
- Puede tener su propio store slice

### `/models`
**Propósito**: Definiciones de tipos e interfaces TypeScript.

**Características**:
- Interfaces basadas en el schema de la base de datos
- Tipos compartidos entre componentes y servicios
- Barrel exports para imports limpios

**Ejemplo**:
```typescript
// models/client.interface.ts
export interface Client {
  id: string;
  first_name: string;
  // ...
}

// Uso en otros archivos
import { Client } from '@models';
```

### `/data`
**Propósito**: Datos mock para desarrollo y presentación.

**Características**:
- Datos hardcodeados para desarrollo
- Simula respuestas de API
- Se reemplazará con llamadas HTTP reales

### `/store`
**Propósito**: Gestión de estado global con NgRx.

**Estructura**:
```
store/
├── app.state.ts          # Estado global
├── index.ts              # Barrel exports
└── clients/              # Store del feature clients
    ├── clients.actions.ts
    ├── clients.reducer.ts
    ├── clients.effects.ts
    └── clients.selectors.ts
```

**Flujo de datos**:
```
Component → dispatch(action) → Effect → Service → API
                                    ↓
                              dispatch(success action)
                                    ↓
                              Reducer → Store
                                    ↓
                              Selector → Component
```

---

## 🔄 Flujo de Datos con NgRx

### 1. **Component dispara Action**
```typescript
// En un componente
this.store.dispatch(loadClients());
```

### 2. **Effect escucha la Action**
```typescript
// clients.effects.ts
loadClients$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loadClients),
    switchMap(() => this.clientsService.getClients())
  )
);
```

### 3. **Effect dispara Success/Failure Action**
```typescript
map(clients => loadClientsSuccess({ clients }))
```

### 4. **Reducer actualiza el Estado**
```typescript
// clients.reducer.ts
on(loadClientsSuccess, (state, { clients }) => ({
  ...state,
  items: clients,
  loading: false
}))
```

### 5. **Component se suscribe al Estado**
```typescript
// En un componente
clients$ = this.store.select(selectAllClients);
```

### 6. **Template muestra los Datos**
```html
<div *ngFor="let client of clients$ | async">
  {{ client.first_name }}
</div>
```

---

## 🎨 Convenciones de Nomenclatura

### Archivos
- **Interfaces**: `nombre.interface.ts` (ej: `client.interface.ts`)
- **Servicios**: `nombre.service.ts` (ej: `clients.service.ts`)
- **Componentes**: `nombre.component.ts` (ej: `client-list.component.ts`)
- **Actions**: `nombre.actions.ts` (ej: `clients.actions.ts`)
- **Reducer**: `nombre.reducer.ts` (ej: `clients.reducer.ts`)
- **Effects**: `nombre.effects.ts` (ej: `clients.effects.ts`)
- **Selectors**: `nombre.selectors.ts` (ej: `clients.selectors.ts`)

### Clases y Variables
- **Clases**: PascalCase (ej: `ClientListComponent`)
- **Variables/Funciones**: camelCase (ej: `loadClients`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `MOCK_CLIENTS`)
- **Interfaces**: PascalCase (ej: `Client`, `ClientsState`)

### NgRx Actions
- **Formato**: `[Feature] Action Description`
- **Ejemplos**:
  - `[Clients] Load Clients`
  - `[Clients] Load Clients Success`
  - `[Clients] Add Client`

---

## 🚀 Cómo Agregar una Nueva Feature

### Paso 1: Crear Modelos
```typescript
// models/nueva-feature.interface.ts
export interface NuevaFeature {
  id: string;
  // ...
}
```

### Paso 2: Crear Store
```typescript
// store/nueva-feature/
// - nueva-feature.actions.ts
// - nueva-feature.reducer.ts
// - nueva-feature.effects.ts
// - nueva-feature.selectors.ts
```

### Paso 3: Registrar en App State
```typescript
// store/app.state.ts
export interface AppState {
  clients: ClientsState;
  nuevaFeature: NuevaFeatureState; // ← Agregar
}
```

### Paso 4: Registrar en App Config
```typescript
// app.config.ts
provideStore({
  clients: clientsReducer,
  nuevaFeature: nuevaFeatureReducer // ← Agregar
}),
provideEffects([
  ClientsEffects,
  NuevaFeatureEffects // ← Agregar
])
```

### Paso 5: Crear Feature Module
```typescript
// features/nueva-feature/
// - components/
// - nueva-feature.routes.ts
```

### Paso 6: Agregar Ruta
```typescript
// app.routes.ts
{
  path: 'nueva-feature',
  loadChildren: () => import('./features/nueva-feature/...')
}
```

---

## 📝 Notas Importantes

### Inmutabilidad
- **Siempre** crear nuevos objetos en reducers
- **Nunca** mutar el estado directamente
- Usar spread operator: `{ ...state, items: [...state.items, newItem] }`

### Pure Functions
- Reducers deben ser funciones puras
- No side effects en reducers
- Side effects van en Effects

### Selectors Memoizados
- Los selectors de NgRx son memoizados por defecto
- Solo recalculan si el input cambia
- Útil para performance

### Lazy Loading
- Feature modules se cargan bajo demanda
- Reduce bundle size inicial
- Mejora tiempo de carga

---

## 🔍 Cómo Navegar el Código

### Buscar un Componente
1. Busca en `features/[feature-name]/components/`
2. O en `shared/components/` si es reutilizable

### Buscar Lógica de Negocio
1. Busca en `core/services/` para servicios globales
2. O en `features/[feature-name]/` para lógica específica

### Buscar Estado
1. Busca en `store/[feature-name]/`
2. Actions: qué eventos pueden ocurrir
3. Reducer: cómo cambia el estado
4. Effects: qué side effects hay
5. Selectors: cómo extraer datos

### Buscar Tipos
1. Busca en `models/`
2. Interfaces definen la estructura de datos

---

## 🎓 Conceptos Clave para Entender la Estructura

### 1. **Standalone Components (Angular 17+)**
- Componentes que no necesitan NgModule
- Importan directamente lo que necesitan
- Más simple y menos boilerplate

### 2. **Dependency Injection**
- Angular inyecta dependencias automáticamente
- `providedIn: 'root'` = singleton app-wide
- `providedIn: 'component'` = nueva instancia por componente

### 3. **Barrel Exports**
- Archivo `index.ts` que exporta todo
- Permite imports limpios: `import { Client } from '@models'`
- En lugar de: `import { Client } from './models/client.interface'`

### 4. **Feature Modules**
- Cada feature es independiente
- Puede desarrollarse por separado
- Facilita trabajo en equipo

---

**Próximos pasos**: Implementar componentes UI para visualizar y manipular los datos del store.

