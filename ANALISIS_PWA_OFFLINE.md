# Análisis PWA y Estrategia Offline-First

## 📊 Estado Actual del Proyecto

### ❌ Lo que NO está configurado:

1. **PWA no instalado**: No hay `@angular/pwa` en `package.json`
2. **Service Worker**: No existe configuración de service worker
3. **Manifest**: No hay `manifest.webmanifest`
4. **ngsw-config.json**: No existe configuración de estrategias de caché
5. **Offline Support**: Los formularios fallarían si el usuario está offline
6. **Sincronización**: No hay cola de sincronización para acciones pendientes

### ✅ Lo que SÍ está bien preparado:

1. **NgRx Store**: Perfecto para sincronización offline
2. **Effects**: Ya manejan side effects (ideal para extender con offline)
3. **Arquitectura modular**: Facilita implementación de servicios offline
4. **Reactive Forms**: Los formularios pueden guardarse localmente

---

## 🎯 Objetivo: Offline-First para Última Acción del Usuario

### Escenario de Uso:
Un usuario está llenando un formulario (cliente o caso) y pierde la conexión. Debe poder:
1. ✅ Completar el formulario offline
2. ✅ Guardar los datos localmente
3. ✅ Ver indicador de estado offline
4. ✅ Sincronizar automáticamente cuando vuelva la conexión
5. ✅ Recuperar el estado del formulario si cierra el navegador

---

## 🏢 Cómo se Hace en Empresas (Mejores Prácticas)

### Estrategia Offline-First (Netflix, Google Docs, Notion)

#### 1. **Optimistic UI Updates**
```typescript
// El usuario ve el cambio inmediatamente
dispatch(addClient({ client })); // ← Optimistic update
// Luego se sincroniza en background
```

#### 2. **Queue de Sincronización**
```typescript
// Cola de acciones pendientes
interface SyncQueue {
  id: string;
  action: Action;
  timestamp: number;
  retries: number;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
}
```

#### 3. **Estrategias de Caché por Tipo de Dato**

| Tipo de Dato | Estrategia | Ejemplo |
|--------------|------------|---------|
| **Assets estáticos** | Cache First | CSS, JS, imágenes |
| **Datos de lectura** | Network First + Cache | Lista de clientes |
| **Formularios activos** | Local First | Formulario en edición |
| **Acciones de escritura** | Queue + Sync | Crear/actualizar cliente |

#### 4. **Persistencia Multi-Capa**

```
┌─────────────────────────────────┐
│   NgRx Store (Memoria)         │  ← Estado reactivo
├─────────────────────────────────┤
│   IndexedDB (Persistencia)     │  ← Datos offline
├─────────────────────────────────┤
│   Service Worker Cache          │  ← Assets y API responses
└─────────────────────────────────┘
```

#### 5. **Indicadores de Estado**

- 🟢 **Online**: Todo funciona normal
- 🟡 **Syncing**: Sincronizando cambios pendientes
- 🔴 **Offline**: Modo offline activo
- ⚠️ **Conflict**: Necesita resolución manual

---

## 📋 Plan de Implementación

### FASE 1: Configuración PWA Básica

#### 1.1 Instalar Dependencias
```bash
ng add @angular/pwa
```

Esto creará:
- `ngsw-config.json` - Configuración del service worker
- `manifest.webmanifest` - Manifest de la PWA
- Actualizará `angular.json` con configuración PWA
- Actualizará `app.config.ts` con service worker

#### 1.2 Configurar Manifest
```json
{
  "name": "Made Legal - Sistema de Gestión Legal",
  "short_name": "Made Legal",
  "theme_color": "#1976d2",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/",
  "icons": [...]
}
```

#### 1.3 Configurar Service Worker (ngsw-config.json)
```json
{
  "$schema": "./node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": [
          "/favicon.ico",
          "/index.html",
          "/*.css",
          "/*.js"
        ]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": [
          "/assets/**",
          "/*.(eot|svg|cur|jpg|png|webp|gif|otf|ttf|woff|woff2)"
        ]
      }
    }
  ],
  "dataGroups": [
    {
      "name": "api-cache",
      "urls": ["/api/**"],
      "cacheConfig": {
        "strategy": "freshness",
        "maxAge": "1h",
        "timeout": "5s",
        "maxEntries": 100
      }
    }
  ]
}
```

---

### FASE 2: Persistencia Offline con IndexedDB

#### 2.1 Crear Servicio de IndexedDB
```typescript
// src/app/core/services/indexeddb.service.ts
@Injectable({ providedIn: 'root' })
export class IndexedDBService {
  private dbName = 'made-legal-db';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    // Inicializar base de datos
  }

  async save<T>(store: string, data: T): Promise<void> {
    // Guardar datos
  }

  async getAll<T>(store: string): Promise<T[]> {
    // Obtener todos los datos
  }

  async delete(store: string, id: string): Promise<void> {
    // Eliminar datos
  }
}
```

#### 2.2 Integrar con NgRx Store
```typescript
// Usar @ngrx/entity-store-sync o crear meta-reducer personalizado
```

---

### FASE 3: Cola de Sincronización

#### 3.1 Crear Servicio de Sincronización
```typescript
// src/app/core/services/sync.service.ts
@Injectable({ providedIn: 'root' })
export class SyncService {
  private syncQueue: SyncQueueItem[] = [];

  async queueAction(action: Action): Promise<void> {
    // Agregar a cola
  }

  async syncPendingActions(): Promise<void> {
    // Sincronizar cuando vuelva conexión
  }

  getPendingCount(): number {
    return this.syncQueue.filter(item => item.status === 'pending').length;
  }
}
```

#### 3.2 Modificar Effects para Soportar Offline
```typescript
// clients.effects.ts
addClient$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ClientsActions.addClient),
    switchMap(({ client }) => {
      // 1. Guardar en IndexedDB inmediatamente (optimistic)
      await this.indexedDBService.save('clients', client);
      
      // 2. Intentar sincronizar con servidor
      if (navigator.onLine) {
        return this.clientsService.addClient(client).pipe(
          map((newClient) => ClientsActions.addClientSuccess({ client: newClient })),
          catchError((error) => {
            // Si falla, agregar a cola de sincronización
            this.syncService.queueAction(ClientsActions.addClient({ client }));
            return of(ClientsActions.addClientOffline({ client }));
          })
        );
      } else {
        // Offline: agregar a cola
        this.syncService.queueAction(ClientsActions.addClient({ client }));
        return of(ClientsActions.addClientOffline({ client }));
      }
    })
  )
);
```

---

### FASE 4: Detección de Estado de Red

#### 4.1 Servicio de Estado de Red
```typescript
// src/app/core/services/network.service.ts
@Injectable({ providedIn: 'root' })
export class NetworkService {
  private online$ = new BehaviorSubject<boolean>(navigator.onLine);

  constructor() {
    window.addEventListener('online', () => this.online$.next(true));
    window.addEventListener('offline', () => this.online$.next(false));
  }

  isOnline(): Observable<boolean> {
    return this.online$.asObservable();
  }
}
```

#### 4.2 Componente de Indicador de Estado
```typescript
// src/app/core/components/network-status/network-status.component.ts
@Component({
  selector: 'app-network-status',
  template: `
    <div *ngIf="isOffline$ | async" class="offline-banner">
      🔴 Sin conexión - Los cambios se guardarán localmente
    </div>
    <div *ngIf="pendingSync$ | async as pending" class="syncing-banner">
      🟡 Sincronizando {{ pending }} cambios...
    </div>
  `
})
export class NetworkStatusComponent {
  isOffline$ = this.networkService.isOnline().pipe(map(online => !online));
  pendingSync$ = this.syncService.getPendingCount$();
}
```

---

### FASE 5: Persistencia de Formularios

#### 5.1 Guardar Estado del Formulario
```typescript
// client-form.component.ts
ngOnInit() {
  // Cargar datos guardados si existen
  this.loadDraftForm();
  
  // Guardar automáticamente cada 5 segundos
  this.clientForm.valueChanges.pipe(
    debounceTime(5000),
    tap(() => this.saveDraftForm())
  ).subscribe();
}

private saveDraftForm(): void {
  const formData = this.clientForm.value;
  localStorage.setItem('client-form-draft', JSON.stringify(formData));
}

private loadDraftForm(): void {
  const draft = localStorage.getItem('client-form-draft');
  if (draft) {
    this.clientForm.patchValue(JSON.parse(draft));
  }
}

onSubmit() {
  // Limpiar draft después de enviar
  localStorage.removeItem('client-form-draft');
  // ... resto del código
}
```

---

## 🔄 Flujo Completo Offline-First

### Escenario: Usuario crea cliente offline

```
1. Usuario llena formulario
   ↓
2. Usuario hace submit
   ↓
3. Sistema detecta offline
   ↓
4. Guarda en IndexedDB (optimistic update)
   ↓
5. Actualiza UI inmediatamente (cliente aparece en lista)
   ↓
6. Agrega acción a cola de sincronización
   ↓
7. Muestra indicador "Sin conexión - Guardado localmente"
   ↓
8. [Usuario continúa trabajando offline]
   ↓
9. Conexión restaurada
   ↓
10. Service detecta online
    ↓
11. Sincroniza cola automáticamente
    ↓
12. Actualiza UI con datos del servidor
    ↓
13. Muestra "Sincronizado correctamente"
```

---

## 📦 Estructura de Archivos a Crear

```
src/app/
├── core/
│   ├── services/
│   │   ├── indexeddb.service.ts          ← NUEVO
│   │   ├── sync.service.ts               ← NUEVO
│   │   ├── network.service.ts            ← NUEVO
│   │   └── offline-storage.service.ts    ← NUEVO
│   ├── components/
│   │   └── network-status/
│   │       ├── network-status.component.ts
│   │       ├── network-status.component.html
│   │       └── network-status.component.scss
│   └── interceptors/
│       └── offline.interceptor.ts        ← NUEVO
├── store/
│   ├── sync/
│   │   ├── sync.actions.ts               ← NUEVO
│   │   ├── sync.reducer.ts               ← NUEVO
│   │   └── sync.effects.ts               ← NUEVO
│   └── meta-reducers/
│       └── offline.meta-reducer.ts       ← NUEVO
└── ...

public/
├── manifest.webmanifest                  ← NUEVO (generado por ng add @angular/pwa)
└── icons/                                ← NUEVO (generado por ng add @angular/pwa)

ngsw-config.json                          ← NUEVO (generado por ng add @angular/pwa)
```

---

## 🧪 Testing Offline

### Estrategias de Testing:

1. **Chrome DevTools**:
   - F12 → Network → Throttling → Offline
   - Application → Service Workers → Update on reload

2. **Testing Automatizado**:
```typescript
describe('Offline Support', () => {
  it('should save client locally when offline', async () => {
    // Simular offline
    spyOnProperty(navigator, 'onLine', 'get').and.returnValue(false);
    
    // Dispatch action
    store.dispatch(addClient({ client: mockClient }));
    
    // Verificar que se guardó en IndexedDB
    const saved = await indexedDBService.getAll('clients');
    expect(saved).toContain(mockClient);
  });
});
```

---

## ⚠️ Consideraciones Importantes

### 1. **Conflictos de Sincronización**
Si dos usuarios editan el mismo registro offline:
- **Estrategia**: Last-Write-Wins o Manual Merge
- **Implementación**: Timestamp en cada actualización

### 2. **Límites de Almacenamiento**
- IndexedDB: ~50MB por dominio
- LocalStorage: ~5-10MB
- **Solución**: Limpiar datos antiguos periódicamente

### 3. **Seguridad**
- No guardar datos sensibles sin encriptar
- Validar datos al sincronizar
- Sanitizar inputs offline

### 4. **Performance**
- No bloquear UI durante sincronización
- Sincronizar en background
- Mostrar progreso al usuario

---

## 📈 Métricas de Éxito

- ✅ Usuario puede completar formulario offline
- ✅ Datos se guardan automáticamente
- ✅ Sincronización automática al volver online
- ✅ Sin pérdida de datos
- ✅ UI responsive durante offline
- ✅ Indicadores claros de estado

---

## 🚀 Próximos Pasos

1. **Implementar FASE 1** (Configuración PWA básica)
2. **Implementar FASE 2** (IndexedDB)
3. **Implementar FASE 3** (Cola de sincronización)
4. **Implementar FASE 4** (Detección de red)
5. **Implementar FASE 5** (Persistencia de formularios)
6. **Testing exhaustivo**
7. **Documentación para usuarios**

---

## 📚 Referencias

- [Angular PWA Documentation](https://angular.io/guide/service-worker-intro)
- [Workbox Strategies](https://developers.google.com/web/tools/workbox/modules/workbox-strategies)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Offline-First Architecture](https://offlinefirst.org/)

