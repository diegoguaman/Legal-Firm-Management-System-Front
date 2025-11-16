# Plan de Trabajo - Made Legal Frontend MVP

## 🎯 Objetivo del Proyecto

Crear un MVP funcional para presentar al cliente mientras aprendes Angular de forma estructurada, enfocándote en:
- **Arquitectura escalable** con Feature Modules y NgRx
- **Estado eficiente** para PWA/offline
- **Código enterprise-ready** con tests y documentación
- **Preparación para entrevistas técnicas** con conceptos bien documentados

---

## 📋 Fases del Proyecto

### **FASE 1: Configuración y Estructura** (Sprint 1)
**Objetivo**: Base sólida con arquitectura escalable

**Tareas**:
1. ✅ Configurar proyecto Angular 20 (standalone components)
2. ⏳ Instalar dependencias: Angular Material, NgRx, PWA
3. ⏳ Crear estructura de carpetas (core, shared, features, models, store)
4. ⏳ Configurar NgRx Store con estructura eficiente
5. ⏳ Configurar PWA básico (Service Worker)
6. ⏳ Crear modelos TypeScript con datos hardcodeados

**Entregables**:
- Proyecto configurado y funcionando
- Estructura de carpetas documentada
- Store de NgRx configurado
- Modelos TypeScript creados

**Conceptos a Aprender**:
- Arquitectura modular Angular
- NgRx Store, Actions, Reducers, Effects
- Standalone Components vs Modules
- Dependency Injection en Angular

---

### **FASE 2: CRUD de Clientes** (Sprint 2)
**Objetivo**: Implementar gestión completa de clientes con datos mock

**Tareas**:
1. Crear servicio de clientes con datos hardcodeados
2. Implementar NgRx: Actions, Reducer, Effects para clientes
3. Crear componente de lista (ClientListComponent)
4. Crear componente de formulario (ClientFormComponent)
5. Implementar Reactive Forms con validaciones
6. Conectar componentes con Store

**Entregables**:
- CRUD completo de clientes funcionando
- UI con Angular Material
- Estado gestionado con NgRx
- Datos mock para demo

**Conceptos a Aprender**:
- Reactive Forms y validaciones
- NgRx Effects para side effects
- Selectors para consultas eficientes
- Component communication patterns

---

### **FASE 3: Expediente y Caso de Nacionalidad** (Sprint 3)
**Objetivo**: Agregar casos y casos de nacionalidad vinculados a clientes

**Tareas**:
1. Crear modelos: Case, CaseNationality
2. Implementar NgRx para casos
3. Crear formulario de caso básico
4. Crear formulario de caso de nacionalidad (complejo)
5. Vincular casos a clientes
6. Mostrar casos en vista de cliente

**Entregables**:
- Formulario de caso funcionando
- Formulario de nacionalidad completo
- Relación cliente-caso implementada
- UI para gestionar casos

**Conceptos a Aprender**:
- Formularios complejos y anidados
- Relaciones entre entidades en NgRx
- Lazy loading de módulos
- Optimistic updates

---

## 🏗️ Estructura del Proyecto

```
src/app/
├── core/                    # Servicios singleton globales
│   ├── auth/               # Autenticación
│   ├── services/           # Servicios genéricos (HTTP, Logger)
│   └── config/             # Configuración
├── shared/                 # Componentes/pipes reutilizables
│   ├── components/         # UI comunes (Header, Sidebar, etc.)
│   └── pipes/              # Transformaciones
├── features/               # Módulos lazy-loaded por funcionalidad
│   ├── dashboard/          # Vista principal
│   ├── clients/            # CRUD clientes
│   └── cases/              # Gestión de casos
├── models/                 # Interfaces TypeScript
│   ├── client.ts
│   ├── case.ts
│   └── case-nationality.ts
└── store/                  # NgRx state management
    ├── app.state.ts
    ├── clients/
    └── cases/
```

---

## 📚 Conceptos Clave para Entrevistas Técnicas

### 1. **NgRx Store - Gestión de Estado**

**¿Qué es?**
NgRx es una implementación de Redux para Angular que gestiona el estado de la aplicación de forma predecible.

**¿Por qué lo usamos?**
- **Estado centralizado**: Una sola fuente de verdad
- **Trazabilidad**: Cada cambio es rastreable (actions)
- **Eficiencia**: Selectors memoizados evitan recálculos
- **PWA/Offline**: Facilita sincronización y cache

**Componentes principales**:
- **Actions**: Eventos que describen qué pasó
- **Reducers**: Funciones puras que calculan nuevo estado
- **Effects**: Side effects (llamadas API, localStorage)
- **Selectors**: Consultas memoizadas del estado

**Ejemplo práctico**:
```typescript
// Action
export const loadClients = createAction('[Clients] Load Clients');

// Effect (llamada API)
loadClients$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loadClients),
    switchMap(() => this.clientsService.getClients()),
    map(clients => loadClientsSuccess({ clients }))
  )
);

// Reducer
const clientsReducer = createReducer(
  initialState,
  on(loadClientsSuccess, (state, { clients }) => ({
    ...state,
    clients,
    loading: false
  }))
);

// Selector (memoizado)
export const selectAllClients = createSelector(
  selectClientsState,
  (state) => state.clients
);
```

---

### 2. **Context y Dependency Injection en Angular**

**¿Qué es el Context?**
En Angular, el contexto se refiere al árbol de inyección de dependencias (DI) que determina qué servicios están disponibles para cada componente.

**Jerarquía de Context**:
```
AppComponent (root)
  └── DashboardComponent
      └── ClientListComponent
          └── ClientCardComponent
```

**Niveles de provisión**:
- **Root**: Singleton global (providedIn: 'root')
- **Module**: Singleton por módulo
- **Component**: Instancia por componente

**¿Por qué es importante para PWA?**
- Servicios compartidos evitan duplicación
- Estado compartido entre componentes
- Cache eficiente a nivel de servicio

**Ejemplo**:
```typescript
// Servicio singleton (root)
@Injectable({ providedIn: 'root' })
export class ClientsService {
  private cache$ = new BehaviorSubject<Client[]>([]);
  
  getClients(): Observable<Client[]> {
    if (this.cache$.value.length > 0) {
      return this.cache$.asObservable(); // Cache hit
    }
    return this.http.get<Client[]>('/api/clients').pipe(
      tap(clients => this.cache$.next(clients))
    );
  }
}
```

---

### 3. **Eficiencia en Carga de Datos**

**Estrategias para PWA/Offline**:

1. **Lazy Loading**:
   - Cargar módulos solo cuando se necesitan
   - Reduce bundle inicial
   ```typescript
   {
     path: 'clients',
     loadChildren: () => import('./features/clients/clients.routes')
   }
   ```

2. **Selectors Memoizados**:
   - Evitan recálculos innecesarios
   - Solo se ejecutan cuando cambian las dependencias
   ```typescript
   export const selectClientsByType = createSelector(
     selectAllClients,
     (clients, type) => clients.filter(c => c.client_type === type)
   );
   ```

3. **OnPush Change Detection**:
   - Solo verifica cambios cuando inputs cambian
   - Mejora performance significativamente
   ```typescript
   @Component({
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   ```

4. **TrackBy Functions**:
   - Evita recrear elementos del DOM
   ```typescript
   trackByClientId(index: number, client: Client): string {
     return client.id;
   }
   ```

5. **Service Worker Caching**:
   - Cache de respuestas API
   - Estrategia: NetworkFirst, CacheFirst, etc.

---

### 4. **Arquitectura Modular (Feature Modules)**

**Principios**:
- **SoC (Separation of Concerns)**: Cada módulo tiene una responsabilidad
- **DRY (Don't Repeat Yourself)**: Componentes compartidos en `shared/`
- **KISS (Keep It Simple)**: Evitar complejidad innecesaria

**Estructura por Feature**:
```
clients/
├── components/
│   ├── client-list/
│   └── client-form/
├── services/
│   └── clients.service.ts
├── store/
│   ├── clients.actions.ts
│   ├── clients.reducer.ts
│   └── clients.effects.ts
└── clients.routes.ts
```

**Ventajas**:
- Código organizado y mantenible
- Lazy loading fácil
- Tests aislados
- Escalabilidad

---

## 🎓 Qué Tener en Cuenta para Dejar de Ser Junior

### 1. **Pensamiento Arquitectónico**
- No solo "funciona", sino "¿por qué esta arquitectura?"
- Considera escalabilidad desde el inicio
- Documenta decisiones técnicas

### 2. **Performance y Optimización**
- Entiende cómo funciona Change Detection
- Usa herramientas de profiling (Angular DevTools)
- Optimiza antes de tener problemas

### 3. **Testing**
- Tests no son opcionales
- Cobertura alta (95%+)
- Tests E2E para flujos críticos

### 4. **Comunicación Técnica**
- Explica el "por qué" no solo el "qué"
- Documenta decisiones
- Code reviews constructivos

### 5. **Conocimiento Profundo**
- No solo usar librerías, entender cómo funcionan
- NgRx: entiende Redux pattern
- RxJS: domina operadores comunes

---

## 📝 Próximos Pasos Inmediatos

1. **Instalar dependencias necesarias**
2. **Crear estructura de carpetas**
3. **Configurar NgRx Store**
4. **Crear modelos con datos mock**
5. **Implementar primer componente**

---

## 🔄 Metodología de Trabajo

1. **Planificar**: Revisar tareas y entender el objetivo
2. **Implementar**: Código siguiendo mejores prácticas
3. **Documentar**: Explicar decisiones técnicas
4. **Testear**: Asegurar funcionamiento
5. **Revisar**: Code review y optimización

---

**Última actualización**: 2025-01-27
**Estado**: Fase 1 en progreso

