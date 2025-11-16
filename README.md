# Made Legal - Sistema de Gestión para Despachos Legales

Sistema de gestión completo para despachos legales construido con Angular y NgRx. Maneja clientes, casos legales, plazos importantes, y documentación.

## 🎯 Estado del Proyecto

**Fase Actual**: Configuración y Estructura Base ✅

- ✅ Estructura de carpetas creada
- ✅ Modelos TypeScript definidos
- ✅ NgRx Store configurado
- ✅ Datos mock disponibles
- ⏳ Componentes UI (próximo paso)

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ y npm
- Angular CLI 20+

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# La aplicación estará disponible en http://localhost:4200
```

### Build para Producción

```bash
npm run build
```

### Tests

```bash
# Unit tests
npm test

# E2E tests (cuando estén configurados)
npm run e2e
```

## 📁 Estructura del Proyecto

```
src/app/
├── core/              # Servicios globales
├── shared/            # Componentes reutilizables
├── features/          # Módulos de funcionalidad
├── models/            # Interfaces TypeScript
├── data/              # Datos mock
└── store/             # NgRx State Management
```

Ver [ESTRUCTURA_PROYECTO.md](./ESTRUCTURA_PROYECTO.md) para detalles completos.

## 🛠️ Tecnologías

- **Angular 20**: Framework principal
- **NgRx**: State management (Redux pattern)
- **RxJS**: Programación reactiva
- **TypeScript**: Tipado estático
- **Angular Material**: Componentes UI (próximamente)

## 📚 Documentación

- [DOCUMENTACION_ESTADO_ANGULAR.md](./DOCUMENTACION_ESTADO_ANGULAR.md) - Guía completa de State Management
- [PLAN_TRABAJO_FASES.md](./PLAN_TRABAJO_FASES.md) - Plan de trabajo por fases
- [GUIA_ENTREVISTAS_TECNICAS.md](./GUIA_ENTREVISTAS_TECNICAS.md) - Preparación para entrevistas
- [ESTRUCTURA_PROYECTO.md](./ESTRUCTURA_PROYECTO.md) - Explicación de la estructura
- [GUIA.md](./GUIA.md) - Guía original del proyecto

## 🎓 Conceptos Clave

### State Management con NgRx

El proyecto usa NgRx para manejar el estado de forma predecible:

1. **Actions**: Eventos que describen qué pasó
2. **Reducers**: Funciones puras que definen cómo cambia el estado
3. **Effects**: Manejan side effects (HTTP calls)
4. **Selectors**: Extraen datos del store eficientemente

Ver [DOCUMENTACION_ESTADO_ANGULAR.md](./DOCUMENTACION_ESTADO_ANGULAR.md) para más detalles.

### Flujo de Datos

```
Component → dispatch(action) → Effect → Service → API
                                    ↓
                              dispatch(success)
                                    ↓
                              Reducer → Store
                                    ↓
                              Selector → Component
```

## 📋 Próximos Pasos

### Fase 2: CRUD de Clientes
- [ ] Componente de lista de clientes
- [ ] Componente de formulario de cliente
- [ ] Integración con store
- [ ] UI con Angular Material

### Fase 3: Casos y Nacionalidad
- [ ] Componente de casos
- [ ] Formulario de nacionalidad
- [ ] Relación cliente-caso

## 🧪 Testing

El proyecto seguirá estas prácticas:

- **Unit Tests**: 95% coverage objetivo
- **E2E Tests**: Cypress (80% coverage objetivo)
- **Test Strategy**: Arrange-Act-Assert

## 🔒 Seguridad

- Validación de inputs
- Sanitización de datos
- HTTPS en producción
- Manejo seguro de datos sensibles (hashes)

## 📝 Convenciones

- **TypeScript strict mode**: Habilitado
- **Nomenclatura**: camelCase para variables, PascalCase para clases
- **Comentarios**: JSDoc para funciones públicas
- **Formato**: Prettier configurado

## 🤝 Contribución

Este es un proyecto de aprendizaje. Las contribuciones son bienvenidas siguiendo las mejores prácticas de Angular y TypeScript.

## 📄 Licencia

Privado - Made Legal

---

**Nota**: Este proyecto está en desarrollo activo. La documentación se actualiza constantemente.
