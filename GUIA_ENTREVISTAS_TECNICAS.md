# Guía: De Junior a Mid-Level - Entrevistas Técnicas

## 🎯 Objetivo
Prepararte para responder preguntas técnicas sobre Angular, NgRx, y arquitectura de software, demostrando que entiendes los conceptos profundamente, no solo cómo usarlos.

---

## 💡 Qué Tener en Cuenta para Dejar de Ser Junior

### 1. **Pensamiento Arquitectónico**

**Junior:** "Funciona, ¿qué más importa?"
**Mid-Level:** "¿Por qué esta solución es mejor que otras? ¿Qué trade-offs tiene?"

**Ejemplo:**
- ❌ Junior: "Uso NgRx porque me dijeron que es bueno"
- ✅ Mid-Level: "Uso NgRx para estado compartido complejo porque necesito time-travel debugging y predecibilidad. Para estado local simple, uso servicios porque es más simple y rápido de implementar."

### 2. **Comprensión del "Por Qué"**

No solo saber **qué** hacer, sino **por qué** hacerlo así.

**Conceptos clave:**
- **Inmutabilidad**: ¿Por qué es importante? ¿Qué problemas resuelve?
- **Pure Functions**: ¿Por qué los reducers deben ser puros?
- **Lazy Loading**: ¿Qué problemas resuelve? ¿Cuándo NO usarlo?
- **OnPush**: ¿Cómo funciona el change detection? ¿Por qué mejora performance?

### 3. **Trade-offs y Decisiones**

**Mid-level entiende que:**
- No hay soluciones perfectas, solo trade-offs
- Cada decisión técnica tiene costos y beneficios
- Contexto importa (no hay "una talla para todos")

**Ejemplo:**
"NgRx añade complejidad pero proporciona predecibilidad. Lo uso cuando el estado es compartido entre múltiples features. Para prototipos rápidos, prefiero servicios simples."

### 4. **Debugging y Troubleshooting**

**Junior:** "No funciona, no sé por qué"
**Mid-Level:** "Voy a investigar sistemáticamente: logs, DevTools, network, state"

**Habilidades:**
- Usar Redux DevTools para inspeccionar estado
- Entender stack traces
- Leer documentación efectivamente
- Buscar en issues de GitHub

### 5. **Testing y Calidad**

**Junior:** "Funciona en mi máquina"
**Mid-Level:** "Necesito tests para asegurar que sigue funcionando"

**Conceptos:**
- Unit tests vs Integration tests vs E2E
- Test coverage (qué cubrir y qué no)
- Mocks y stubs
- Test-driven development (cuándo aplicarlo)

### 6. **Performance y Optimización**

**Junior:** "Funciona, está bien"
**Mid-Level:** "¿Cómo puedo hacerlo más rápido? ¿Dónde están los cuellos de botella?"

**Métricas importantes:**
- Bundle size
- First Contentful Paint (FCP)
- Time to Interactive (TTI)
- Change detection cycles

### 7. **Comunicación Técnica**

**Junior:** "Hice X"
**Mid-Level:** "Implementé X usando Y porque Z, considerando alternativas A y B"

**Habilidades:**
- Explicar conceptos complejos de forma simple
- Documentar decisiones técnicas
- Code reviews constructivos
- Presentar soluciones a stakeholders

---

## 🗣️ Cómo Responder en Entrevistas Técnicas

### Estructura de Respuesta (STAR Method)

**S**ituation (Situación)
**T**ask (Tarea)
**A**ction (Acción)
**R**esult (Resultado)

**Ejemplo:**
> **Pregunta:** "¿Cómo manejas el estado en una aplicación Angular grande?"
> 
> **Respuesta:**
> - **Situación**: "En el proyecto Made Legal, teníamos múltiples features (clientes, casos, deadlines) que necesitaban compartir estado."
> - **Tarea**: "Necesitábamos una solución escalable que permitiera rastrear cambios y debuggear fácilmente."
> - **Acción**: "Implementamos NgRx Store con feature modules. Cada feature tiene su propio slice de estado (clients, cases). Usamos selectors memoizados para performance y effects para manejar llamadas HTTP."
> - **Resultado**: "Esto nos permitió tener un estado predecible, fácil de debuggear con Redux DevTools, y escalable para agregar nuevas features."

### Tipos de Preguntas y Cómo Responderlas

#### 1. Preguntas Conceptuales

**Ejemplo:** "¿Qué es NgRx y por qué lo usarías?"

**Estructura de respuesta:**
1. **Definición breve**: "NgRx es una implementación del patrón Redux para Angular"
2. **Problema que resuelve**: "Resuelve el problema de manejar estado compartido en aplicaciones grandes"
3. **Cuándo usarlo**: "Lo uso cuando..."
4. **Cuándo NO usarlo**: "No lo usaría para..."
5. **Ejemplo práctico**: "En mi proyecto..."

**Respuesta completa:**
> "NgRx es una implementación del patrón Redux para Angular que proporciona state management predecible. Lo uso cuando tengo estado compartido entre múltiples features porque ofrece:
> - Single source of truth
> - Time-travel debugging
> - Mejor testabilidad
> 
> Sin embargo, no lo usaría para estado local de un componente o aplicaciones muy pequeñas porque añade complejidad innecesaria.
> 
> En Made Legal, lo implementé para manejar clientes y casos porque estos datos se usan en múltiples componentes y necesitaba rastrear cambios para debugging."

#### 2. Preguntas de Implementación

**Ejemplo:** "¿Cómo implementarías un CRUD de clientes con NgRx?"

**Estructura:**
1. **Arquitectura**: "Usaría Actions, Reducer, Effects, Selectors"
2. **Flujo**: "El componente dispara una acción → Effect hace HTTP → Reducer actualiza estado"
3. **Detalles técnicos**: Código específico
4. **Consideraciones**: Errores, loading, optimizaciones

**Respuesta completa:**
> "Implementaría un CRUD completo con esta arquitectura:
> 
> **Actions**: `loadClients`, `loadClientsSuccess`, `loadClientsFailure`, `addClient`, `updateClient`, `deleteClient`
> 
> **Reducer**: Maneja el estado con propiedades `items`, `loading`, `error`. Siempre retorno nuevos objetos para mantener inmutabilidad.
> 
> **Effects**: Escuchan acciones y hacen llamadas HTTP. Por ejemplo, `loadClients$` escucha `loadClients`, llama al servicio, y dispara `loadClientsSuccess` o `loadClientsFailure`.
> 
> **Selectors**: Extraen datos del store. Uso `createSelector` para memoización y mejor performance.
> 
> **Componente**: Se subscribe a selectors con `async` pipe y dispara acciones con `dispatch()`.
> 
> También manejaría estados de loading y errores para mejor UX."

#### 3. Preguntas de "Qué Harías Si..."

**Ejemplo:** "¿Qué harías si la aplicación es lenta?"

**Estructura:**
1. **Investigar primero**: "Mediría performance antes de optimizar"
2. **Identificar problemas**: "Usaría Chrome DevTools, Lighthouse"
3. **Soluciones específicas**: Lista de optimizaciones
4. **Priorizar**: "Empezaría por lo que más impacto tiene"

**Respuesta completa:**
> "Primero mediría el performance actual usando:
> - Chrome DevTools Performance tab
> - Lighthouse para métricas web
> - Angular DevTools para change detection
> 
> Luego identificaría cuellos de botella comunes:
> - Bundle size grande → Lazy loading de módulos
> - Muchos change detection cycles → OnPush strategy
> - Re-renders innecesarios → Memoización con selectors
> - Imágenes grandes → Optimización y lazy loading
> 
> Priorizaría según impacto: primero lazy loading (reduce bundle inicial), luego OnPush (mejora runtime performance)."

#### 4. Preguntas de Comparación

**Ejemplo:** "NgRx vs Services, ¿cuándo usar cada uno?"

**Estructura:**
1. **Definir cada opción**: Qué es cada uno
2. **Ventajas y desventajas**: De cada uno
3. **Cuándo usar cada uno**: Criterios claros
4. **Ejemplo práctico**: Cuándo elegiste uno u otro

**Respuesta completa:**
> "**NgRx** es mejor para:
> - Estado compartido complejo entre múltiples features
> - Necesitas time-travel debugging
> - Aplicaciones grandes con muchos componentes
> - Estado que cambia frecuentemente y necesita rastreo
> 
> **Services** son mejores para:
> - Estado simple compartido entre pocos componentes
> - Cache básico
> - Lógica de negocio que no es estado
> - Prototipos rápidos
> 
> En Made Legal, uso NgRx para clientes y casos porque estos datos se usan en dashboard, listas, formularios, y detalles. Pero uso servicios para configuración de la app o utilidades que no son estado."

---

## 📋 Preguntas Frecuentes y Respuestas Modelo

### Angular Core

**P: ¿Qué es el Change Detection en Angular?**
> "Angular tiene un sistema de detección de cambios que verifica si el modelo cambió y actualiza la vista. Hay dos estrategias:
> - **Default**: Verifica todos los componentes en cada ciclo
> - **OnPush**: Solo verifica cuando inputs cambian, eventos del componente, o observables con async pipe emiten
> 
> OnPush mejora performance porque reduce checks innecesarios. Lo uso en componentes que reciben datos del store porque solo necesito verificar cuando el store cambia."

**P: ¿Qué es Dependency Injection?**
> "DI es un patrón donde Angular proporciona dependencias automáticamente en lugar de que las crees manualmente. Angular tiene un árbol de inyectores:
> - Root level (`providedIn: 'root'`): Singleton en toda la app
> - Module level: Una instancia por módulo
> - Component level: Nueva instancia por componente
> 
> Esto facilita testing porque puedo mockear dependencias fácilmente."

**P: ¿Qué son los Standalone Components?**
> "Son componentes que no necesitan un NgModule. Pueden importar directamente lo que necesitan. Esto simplifica la estructura y reduce boilerplate. En Angular 17+, es la forma recomendada de crear componentes."

### NgRx

**P: ¿Cuál es la diferencia entre Action, Reducer y Effect?**
> "**Actions** son eventos que describen qué pasó (ej: 'usuario hizo clic en cargar clientes'). Son objetos planos con type y payload.
> 
> **Reducers** son funciones puras que definen cómo cambia el estado cuando se dispara una acción. Toman estado actual + acción y retornan nuevo estado.
> 
> **Effects** manejan side effects (HTTP, localStorage). Escuchan acciones y pueden disparar nuevas acciones. Mantienen los reducers puros."

**P: ¿Por qué los reducers deben ser puros?**
> "Porque permite:
> - Predecibilidad: mismo input → mismo output
> - Testabilidad: fácil de testear sin mocks complejos
> - Time-travel debugging: puedes 'viajar' en el tiempo del estado
> - Inmutabilidad: facilita comparación por referencia
> 
> Si necesitas side effects (HTTP, etc.), los pones en Effects, no en reducers."

**P: ¿Qué son los Selectors y por qué son importantes?**
> "Selectors son funciones que extraen datos del store. Pueden ser memoizados (cached) para mejor performance. Si el input no cambia, retornan el valor cached en lugar de recalcular.
> 
> Esto es crucial para performance cuando tienes cálculos costosos o transformaciones de datos."

### RxJS

**P: ¿Cuál es la diferencia entre Observable, Subject y BehaviorSubject?**
> "**Observable**: Stream de datos que emite valores. No mantiene estado, cada subscription es independiente.
> 
> **Subject**: Observable que puede emitir valores manualmente. No mantiene el último valor.
> 
> **BehaviorSubject**: Subject que mantiene el último valor y lo emite a nuevos subscribers inmediatamente.
> 
> Uso BehaviorSubject para estado que necesito compartir (ej: usuario actual), Observable para streams de datos (ej: HTTP calls)."

**P: ¿Cuándo usar switchMap vs mergeMap vs exhaustMap?**
> "**switchMap**: Cancela la petición anterior si llega una nueva. Útil para búsquedas donde solo importa el último resultado.
> 
> **mergeMap**: Permite múltiples peticiones simultáneas. Útil cuando quieres todas las respuestas.
> 
> **exhaustMap**: Ignora nuevas peticiones hasta que termine la actual. Útil para prevenir múltiples submits de formularios.
> 
> En NgRx Effects, generalmente uso switchMap para evitar peticiones duplicadas."

### Performance

**P: ¿Cómo optimizas una aplicación Angular?**
> "Varias estrategias:
> 1. **Lazy Loading**: Cargar módulos solo cuando se necesitan
> 2. **OnPush Change Detection**: Reducir checks innecesarios
> 3. **Memoización con Selectors**: Evitar recálculos
> 4. **TrackBy en *ngFor**: Evitar re-render completo de listas
> 5. **Virtual Scrolling**: Para listas grandes
> 6. **Bundle optimization**: Tree-shaking, code splitting
> 
> Primero mido con DevTools, luego optimizo según los cuellos de botella encontrados."

---

## 🎯 Qué Buscan los Interviewers

### 1. **Comprensión Profunda**
No solo saber usar una herramienta, sino entender por qué existe y qué problemas resuelve.

### 2. **Pensamiento Crítico**
Poder evaluar trade-offs y tomar decisiones informadas.

### 3. **Comunicación Clara**
Explicar conceptos técnicos de forma comprensible.

### 4. **Experiencia Práctica**
Ejemplos concretos de proyectos reales, no solo teoría.

### 5. **Curiosidad y Aprendizaje**
Mostrar interés en aprender y mejorar continuamente.

---

## 💼 Cómo Presentar el Proyecto Made Legal

### Elevator Pitch (30 segundos)
> "Made Legal es un sistema de gestión para despachos legales construido con Angular y NgRx. Maneja clientes, casos legales, y plazos importantes. Implementé state management con NgRx para manejar datos complejos, formularios reactivos para entrada de datos, y una arquitectura escalable con feature modules y lazy loading."

### Puntos Clave a Mencionar

1. **Arquitectura**
   - "Usé feature modules con lazy loading para mejor performance"
   - "Implementé NgRx Store para estado compartido entre múltiples features"
   - "Separé concerns: core (servicios globales), shared (componentes reutilizables), features (lógica de negocio)"

2. **Decisiones Técnicas**
   - "Elegí NgRx sobre servicios simples porque necesitaba rastrear cambios y debuggear fácilmente"
   - "Usé Reactive Forms porque necesitaba validaciones complejas y dinámicas"
   - "Implementé OnPush change detection para optimizar performance"

3. **Desafíos y Soluciones**
   - "Desafío: Manejar relaciones complejas entre clientes y casos"
   - "Solución: Store normalizado con selectors que combinan datos de diferentes slices"

4. **Aprendizajes**
   - "Aprendí la importancia de la inmutabilidad en el estado"
   - "Entendí cómo funciona el change detection y cómo optimizarlo"
   - "Mejoré en arquitectura de software y toma de decisiones técnicas"

---

## 📚 Recursos para Prepararte

### Práctica
1. **Explica conceptos en voz alta**: Graba videos explicando conceptos
2. **Code reviews**: Revisa código de otros proyectos
3. **Proyectos pequeños**: Crea proyectos para practicar conceptos específicos
4. **Mock interviews**: Practica con amigos o mentores

### Estudio
1. **Documentación oficial**: Angular, NgRx, RxJS
2. **Artículos técnicos**: Medium, Dev.to, Angular blog
3. **Videos**: YouTube channels de Angular
4. **Código fuente**: Lee código de librerías que usas

### Mentalidad
1. **No tengas miedo de decir "no sé"**: Pero sigue con "pero esto es lo que haría para investigarlo"
2. **Pregunta aclaraciones**: Si no entiendes la pregunta, pregunta
3. **Piensa en voz alta**: Los interviewers quieren ver tu proceso de pensamiento
4. **Sé honesto**: No inventes experiencia que no tienes

---

## ✅ Checklist Pre-Entrevista

- [ ] Puedo explicar qué es NgRx y cuándo usarlo
- [ ] Entiendo la diferencia entre Actions, Reducers, Effects, Selectors
- [ ] Sé explicar cómo funciona el Change Detection
- [ ] Puedo discutir trade-offs de decisiones técnicas
- [ ] Tengo ejemplos concretos de mi proyecto
- [ ] Puedo explicar por qué elegí ciertas soluciones
- [ ] Entiendo conceptos de performance en Angular
- [ ] Sé cómo debuggear problemas comunes
- [ ] Puedo explicar RxJS operators comunes
- [ ] Tengo preguntas preparadas para el interviewer

---

**Recuerda**: El objetivo no es saber todo, sino demostrar que puedes aprender y pensar críticamente sobre problemas técnicos.

