# Seguridad de Datos: Hash vs Encriptación

## 🔐 Problema Identificado

**Problema actual:**
- Los datos están **hasheados** (DNI, email, teléfono)
- El hash es **unidireccional** (no se puede revertir)
- No se pueden usar para autocompletar documentos
- La abogada no puede ver/copiar los datos

**Necesidad:**
- Los datos deben ser **legibles** para uso práctico
- Deben cumplir con **RGPD** (protección de datos)
- Deben ser **seguros** en la base de datos

---

## 💡 Solución: Encriptación vs Hash

### Hash (Unidireccional) ❌ Para Datos que Necesitan Ser Legibles

**¿Qué es?**
- Función matemática que convierte datos en un valor fijo
- **No se puede revertir** (unidireccional)
- Mismo input → mismo output (determinístico)

**Cuándo usar:**
- ✅ **Passwords**: Nunca deben ser legibles
- ✅ **Verificación de integridad**: Detectar si datos fueron modificados
- ❌ **Datos que necesitan ser legibles**: DNI, email, teléfono

**Ejemplo:**
```typescript
// Hash de password
password: "miPassword123"
hash: "a1b2c3d4e5f6..." // No se puede revertir

// ❌ PROBLEMA: Si necesitas el DNI original, no puedes obtenerlo
dni_hash: "hash_12345678A" // No puedes obtener "12345678A"
```

### Encriptación (Bidireccional) ✅ Para Datos que Necesitan Ser Legibles

**¿Qué es?**
- Proceso de convertir datos en formato ilegible usando una clave
- **Se puede revertir** (desencriptar) con la clave correcta
- Los datos están protegidos pero accesibles cuando se necesitan

**Cuándo usar:**
- ✅ **Datos sensibles que necesitan ser legibles**: DNI, email, teléfono
- ✅ **Cumplimiento RGPD**: Datos protegidos en reposo
- ✅ **Autocompletar documentos**: Se pueden desencriptar cuando se necesitan

**Ejemplo:**
```typescript
// Encriptación de DNI
dni_original: "12345678A"
dni_encrypted: "a1b2c3d4e5f6..." // Encriptado en BD
dni_decrypted: "12345678A" // Desencriptado cuando se necesita
```

---

## 🏗️ Arquitectura Recomendada

### Estrategia Híbrida

```
┌─────────────────────────────────────────┐
│         Frontend (Angular)              │
│  - Recibe datos DESENCRIPTADOS          │
│  - Nunca maneja claves de encriptación  │
│  - Muestra datos legibles al usuario    │
└──────────────┬──────────────────────────┘
               │ HTTPS (datos encriptados en tránsito)
               ▼
┌─────────────────────────────────────────┐
│      Backend API (.NET)                  │
│  - Desencripta datos antes de enviar    │
│  - Encripta datos antes de guardar      │
│  - Maneja claves de encriptación        │
│  - Valida permisos de usuario           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Base de Datos (PostgreSQL)          │
│  - Datos ENCRIPTADOS en reposo           │
│  - Hash solo para passwords              │
│  - RLS (Row Level Security) activado     │
└─────────────────────────────────────────┘
```

### Flujo de Datos

**1. Crear Cliente:**
```
Frontend → Backend (datos en texto plano)
Backend → Encripta datos sensibles
Backend → Guarda en BD (datos encriptados)
```

**2. Leer Cliente:**
```
Frontend → Backend (solicita cliente)
Backend → Lee de BD (datos encriptados)
Backend → Desencripta datos
Backend → Envía a Frontend (datos desencriptados)
Frontend → Muestra datos legibles
```

**3. Autocompletar Documento:**
```
Frontend → Backend (solicita datos del cliente)
Backend → Desencripta datos
Backend → Envía datos desencriptados
Frontend → Usa datos para autocompletar
```

---

## 📋 Modelo Actualizado

### Cambios en el Modelo

**Antes (con hash):**
```typescript
export interface Client {
  dni_nie_hash: string;      // ❌ No se puede revertir
  phone_hash?: string;       // ❌ No se puede revertir
  email_hash?: string;       // ❌ No se puede revertir
}
```

**Después (con encriptación):**
```typescript
export interface Client {
  dni_nie: string;           // ✅ Desencriptado por backend
  phone?: string;            // ✅ Desencriptado por backend
  email?: string;            // ✅ Desencriptado por backend
  // Nota: En BD están encriptados, pero el frontend recibe desencriptados
}
```

### En la Base de Datos

**Columnas en PostgreSQL:**
```sql
-- Datos encriptados (en reposo)
dni_nie_encrypted TEXT,      -- Encriptado con AES-256
phone_encrypted TEXT,        -- Encriptado con AES-256
email_encrypted TEXT,        -- Encriptado con AES-256

-- Hash solo para passwords
password_hash TEXT,          -- Hash con bcrypt/argon2

-- Índices para búsqueda (opcional)
dni_nie_hash_index TEXT,    -- Hash solo para búsqueda rápida
```

**Nota:** El backend puede mantener un hash adicional solo para búsquedas rápidas, pero los datos reales están encriptados.

---

## 🔒 Implementación en Backend (.NET)

### Encriptación Simétrica (AES-256)

```csharp
// Ejemplo en C# (.NET)
public class EncryptionService
{
    private readonly string _encryptionKey; // Desde variables de entorno
    
    public string Encrypt(string plainText)
    {
        // Encriptar usando AES-256
        // Retornar texto encriptado en Base64
    }
    
    public string Decrypt(string encryptedText)
    {
        // Desencriptar usando AES-256
        // Retornar texto original
    }
}

// Uso en servicio de clientes
public class ClientsService
{
    public async Task<ClientDto> GetClientAsync(string id)
    {
        var client = await _db.Clients.FindAsync(id);
        
        // Desencriptar datos sensibles
        return new ClientDto
        {
            Id = client.Id,
            DniNie = _encryptionService.Decrypt(client.DniNieEncrypted),
            Phone = _encryptionService.Decrypt(client.PhoneEncrypted),
            Email = _encryptionService.Decrypt(client.EmailEncrypted),
            // ... otros campos
        };
    }
}
```

### Variables de Entorno

```env
# .env (nunca commitear)
ENCRYPTION_KEY=tu_clave_secreta_muy_larga_y_segura_aqui
ENCRYPTION_IV=tu_vector_inicializacion_aqui
```

---

## 🎯 Estrategia de Seguridad Completa

### 1. Encriptación en Reposo (At Rest)
- ✅ Datos encriptados en la base de datos
- ✅ Claves de encriptación en variables de entorno
- ✅ Nunca hardcodear claves

### 2. Encriptación en Tránsito (In Transit)
- ✅ HTTPS/TLS para todas las comunicaciones
- ✅ Certificados SSL válidos
- ✅ No enviar datos sensibles por HTTP

### 3. Control de Acceso
- ✅ Autenticación (JWT tokens)
- ✅ Autorización (roles y permisos)
- ✅ Row Level Security (RLS) en PostgreSQL
- ✅ Solo usuarios autorizados pueden desencriptar

### 4. Auditoría
- ✅ Logs de acceso a datos sensibles
- ✅ Registro de quién accedió a qué datos
- ✅ Cumplimiento RGPD

---

## 📝 Actualización del Modelo Frontend

### Nuevo Modelo

```typescript
/**
 * Client interface
 * NOTA: Los datos sensibles (dni_nie, phone, email) están ENCRIPTADOS en la BD,
 * pero el backend los DESENCRIPTA antes de enviarlos al frontend.
 * El frontend siempre recibe datos legibles.
 */
export interface Client {
  id: string;
  
  // Datos sensibles (encriptados en BD, desencriptados por backend)
  dni_nie: string;              // Cambiado de dni_nie_hash
  phone?: string;               // Cambiado de phone_hash
  email?: string;               // Cambiado de email_hash
  
  // Datos no sensibles (sin encriptar)
  first_name: string;
  last_name: string;
  address_street?: string;
  address_city?: string;
  address_province?: string;
  address_zip?: string;
  nationality?: string;
  client_type: 'FISICO' | 'JURIDICO';
  extra_data?: Record<string, any>;
  
  // Metadatos
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}
```

### Ventajas

1. **Usabilidad:**
   - ✅ Datos legibles para autocompletar documentos
   - ✅ La abogada puede ver y copiar datos
   - ✅ Fácil de usar en formularios

2. **Seguridad:**
   - ✅ Datos protegidos en la base de datos
   - ✅ Cumplimiento RGPD
   - ✅ Solo usuarios autorizados pueden acceder

3. **Escalabilidad:**
   - ✅ Backend maneja toda la lógica de encriptación
   - ✅ Frontend no necesita saber sobre encriptación
   - ✅ Fácil cambiar algoritmo de encriptación sin afectar frontend

---

## 🔄 Migración desde Hash a Encriptación

### Pasos para Migrar

**1. Backend:**
- Implementar servicio de encriptación
- Crear migración para cambiar columnas
- Migrar datos existentes (si los hay)
- Actualizar endpoints para desencriptar antes de enviar

**2. Frontend:**
- Actualizar interfaces TypeScript
- Actualizar formularios (ya no usar "_hash")
- Actualizar componentes de visualización
- Actualizar datos mock

**3. Testing:**
- Verificar que datos se muestran correctamente
- Verificar que autocompletado funciona
- Verificar que encriptación funciona en backend

---

## ⚠️ Consideraciones Importantes

### 1. Hash para Búsqueda (Opcional)

Si necesitas buscar por DNI rápidamente, puedes mantener un hash adicional:

```typescript
export interface Client {
  dni_nie: string;              // Desencriptado (para mostrar)
  dni_nie_hash_index?: string;  // Hash solo para búsqueda rápida
}
```

**Uso:**
- Hash para búsqueda rápida en BD
- Datos encriptados para almacenamiento seguro
- Datos desencriptados para uso en frontend

### 2. Passwords Siempre con Hash

```typescript
// Para usuarios del sistema (no clientes)
export interface User {
  email: string;              // Encriptado (para login)
  password_hash: string;      // Hash (nunca desencriptar)
}
```

### 3. Performance

- Encriptación/desencriptación tiene costo computacional
- Considerar caching de datos desencriptados (con expiración)
- Usar índices en BD para búsquedas rápidas

---

## ✅ Resumen

### Para Datos que Necesitan Ser Legibles:
- ✅ **Encriptación** (reversible)
- ✅ Backend maneja encriptación/desencriptación
- ✅ Frontend recibe datos desencriptados
- ✅ Datos protegidos en reposo

### Para Passwords:
- ✅ **Hash** (unidireccional)
- ✅ Nunca se puede revertir
- ✅ Verificación con hash comparison

### Seguridad Completa:
- ✅ Encriptación en reposo (BD)
- ✅ Encriptación en tránsito (HTTPS)
- ✅ Control de acceso (autenticación/autorización)
- ✅ Auditoría (logs)

---

**Conclusión:** Cambiar de hash a encriptación para datos que necesitan ser legibles es la solución correcta. El hash solo debe usarse para passwords.

