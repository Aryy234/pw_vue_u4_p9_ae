# Documentación del Sistema de Autenticación

## Descripción General

Sistema de autenticación JWT implementado en Vue 3 sin utilizar Pinia, basado en Composition API, localStorage y composables reutilizables. El sistema se integra con una API REST de Quarkus para gestionar el login de usuarios y proteger rutas de la aplicación.

---

## Arquitectura del Sistema

### Flujo de Autenticación

```
Usuario → LoginView → useAuth (composable) → authorizationClient → API Quarkus
                                    ↓
                              localStorage (token)
                                    ↓
                         Router Guard → Validación JWT
                                    ↓
                            Rutas Protegidas/Acceso
```

---

## Archivos Creados

### 1. `src/client/authorizationClient.js`

**Propósito:** Cliente HTTP para comunicarse con la API de autenticación.

**Funciones principales:**
- `login(username, password)` - Envía credenciales al endpoint de login
- `logout()` - Cierra la sesión (limpia datos locales)
- `loginFachada()` - Patrón fachada para abstraer llamadas asíncronas
- `logoutFachada()` - Patrón fachada para logout

**Endpoint utilizado:**
```
POST http://localhost:8082/auth/api/v1.0/auth/login
Body: { "username": "string", "password": "string" }
Response: { token, username, email, roles, enabled }
```

---

### 2. `src/utils/jwtHelper.js`

**Propósito:** Utilidades para trabajar con tokens JWT.

**Funciones principales:**

| Función | Descripción | Retorno |
|---------|-------------|---------|
| `decodeToken(token)` | Decodifica el payload de un JWT | Object o null |
| `isTokenExpired(token)` | Verifica si el token expiró | Boolean |
| `getTokenExpirationTime(token)` | Obtiene segundos restantes | Number |
| `getUserFromToken(token)` | Extrae datos del usuario | Object o null |

**Implementación:**
- Decodifica Base64URL del payload JWT
- Compara timestamp `exp` con fecha actual
- Extrae campos: `upn`, `email`, `groups`, `uid`

---

### 3. `src/composables/useAuth.js`

**Propósito:** Composable central para gestión de autenticación con estado reactivo global.

**Estado reactivo:**
```javascript
const token = ref(localStorage.getItem('token') || null);
const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
const loading = ref(false);
const error = ref(null);
```

**Computed properties:**
- `isAuthenticated` - Verifica token válido y no expirado
- `currentUser` - Datos del usuario actual
- `userRoles` - Array de roles del usuario
- `isAdmin` - Verifica si tiene rol 'admin'

**Métodos principales:**

| Método | Descripción |
|--------|-------------|
| `login(username, password)` | Autentica usuario y guarda datos |
| `logout()` | Cierra sesión y limpia localStorage |
| `checkTokenExpiration()` | Valida expiración del token |
| `getToken()` | Obtiene el token actual |
| `initializeAuth()` | Inicializa estado desde localStorage |
| `saveAuthData(data)` | Persiste token y usuario |
| `clearAuthData()` | Limpia toda la sesión |

**Persistencia:**
- Token y datos de usuario en `localStorage`
- Estado reactivo sincronizado automáticamente
- Verificación de expiración en cada acceso

---

### 4. `src/views/LoginView.vue`

**Propósito:** Vista de inicio de sesión con formulario y validación.

**Características:**
- Formulario reactivo con `v-model`
- Validación en tiempo real (campos no vacíos)
- Manejo de errores de autenticación
- Estados de carga (loading)
- Redirección automática después del login
- Soporte para query param `redirect`

**Validaciones:**
- Campos obligatorios (username, password)
- Deshabilitar botón si formulario inválido
- Deshabilitar inputs durante carga

**Flujo:**
1. Usuario ingresa credenciales
2. Submit dispara `handleLogin()`
3. Llama a `useAuth().login()`
4. Si éxito → Redirige a home o ruta guardada
5. Si error → Muestra mensaje en rojo

---

## Archivos Modificados

### 5. `src/client/matriculaClient.js`

**Cambios realizados:**

#### Interceptor de Request
```javascript
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```
**Funcionalidad:** Añade automáticamente el token JWT a todas las peticiones HTTP.

#### Interceptor de Response
```javascript
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.hash = '#/login';
      alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    }
    return Promise.reject(error);
  }
);
```
**Funcionalidad:** Maneja errores 401 (no autorizado) redirigiendo al login y limpiando sesión.

---

### 6. `src/router/index.js`

**Cambios realizados:**

#### Nueva ruta de login
```javascript
{
  path: '/login',
  name: 'login',
  component: () => import('../views/LoginView.vue'),
  meta: { requiresGuest: true }
}
```

#### Meta campos en rutas protegidas
Todas las rutas de `/estudiantes/*` ahora tienen:
```javascript
meta: { requiresAuth: true }
```

#### Guard de navegación global
```javascript
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = token && !isTokenExpired(token);

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirige a login guardando la ruta destino
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (to.meta.requiresGuest && isAuthenticated) {
    // Si ya está logueado, no puede ir a login
    next({ name: 'home' });
  } else {
    next();
  }
});
```

**Funcionalidad:**
- Protege rutas que requieren autenticación
- Guarda ruta destino para redirección post-login
- Previene acceso a login si ya está autenticado
- Verifica expiración del token antes de permitir acceso

---

### 7. `src/App.vue`

**Cambios realizados:**

#### Template dinámico
- Enlaces de estudiantes solo visibles si `isAuthenticated`
- Sección de usuario en esquina superior derecha
- Badge "Admin" si usuario tiene rol admin
- Botón "Cerrar Sesión" o enlace "Iniciar Sesión"

#### Script con Composition API
```javascript
import { onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';

setup() {
  const { isAuthenticated, currentUser, isAdmin, logout, initializeAuth } = useAuth();
  
  onMounted(() => {
    initializeAuth(); // Restaura sesión al cargar la app
  });
  
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };
}
```

#### Estilos actualizados
- Navbar con flexbox y posicionamiento responsive
- Estilos para badge de admin
- Botones de logout y login estilizados
- Media query para dispositivos móviles

---

## Flujos de Usuario

### 1. Flujo de Login Exitoso

```
1. Usuario accede a /login
2. Ingresa credenciales (Ariel / Elizalde)
3. Click en "Iniciar Sesión"
4. LoginView → useAuth.login()
5. authorizationClient → POST a API
6. API retorna { token, username, email, roles, enabled }
7. useAuth guarda en localStorage
8. Router redirige a home o ruta guardada
9. Navbar muestra nombre de usuario y enlaces de estudiantes
```

### 2. Flujo de Acceso a Ruta Protegida

```
1. Usuario intenta acceder a /estudiantes/consultar-todos
2. Router guard verifica token en localStorage
3. jwtHelper.isTokenExpired() valida expiración
4. Si válido → Permite acceso
5. Si inválido → Redirige a /login?redirect=/estudiantes/consultar-todos
6. Después del login → Redirige automáticamente a la ruta original
```

### 3. Flujo de Petición HTTP Protegida

```
1. Componente llama a matriculaClient.consultarTodos()
2. Interceptor request añade: Authorization: Bearer {token}
3. API Quarkus valida token
4. Si válido → Retorna datos
5. Si 401 → Interceptor response limpia sesión y redirige a login
```

### 4. Flujo de Logout

```
1. Usuario click en "Cerrar Sesión"
2. App.vue → handleLogout()
3. useAuth.logout() → clearAuthData()
4. localStorage.removeItem('token' y 'user')
5. Estado reactivo actualiza isAuthenticated = false
6. Navbar oculta enlaces de estudiantes
7. Router redirige a /login
```

### 5. Flujo de Token Expirado

```
1. Usuario navega con token expirado
2. Router guard ejecuta isTokenExpired()
3. Detecta expiración → clearAuthData()
4. Redirige a /login con mensaje
   O
1. Usuario hace petición HTTP con token expirado
2. API retorna 401
3. Interceptor response detecta error
4. Limpia localStorage
5. Redirige a /login con alert
```

---

## Estructura de Datos

### Token JWT Decodificado

```json
{
  "iss": "matricula-auth",
  "upn": "Ariel",
  "groups": ["admin"],
  "email": "marcelo-elizalde@hotmail.com",
  "uid": "0fdcdacf-a1d0-401a-9c87-e18dd718c4c2",
  "iat": 1770248245,
  "exp": 1770248545,
  "jti": "9fa3b6e1-521e-48f3-9a9d-5e6fb981d3f2"
}
```

### Datos en localStorage

**Key: `token`**
```
eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJt...
```

**Key: `user`**
```json
{
  "username": "Ariel",
  "email": "marcelo-elizalde@hotmail.com",
  "roles": ["admin"],
  "enabled": true
}
```

---

## Configuración de Rutas

### Rutas Públicas
- `/` - Home
- `/about` - About
- `/login` - Login (solo si NO está autenticado)

### Rutas Protegidas (requieren autenticación)
- `/estudiantes/consultar-todos`
- `/estudiantes/consultar-por-id`
- `/estudiantes/guardar`
- `/estudiantes/actualizar`
- `/estudiantes/actualizar-parcial`
- `/estudiantes/borrar`

---

## Seguridad Implementada

### 1. Validación de Token
- ✅ Verificación de expiración antes de cada navegación
- ✅ Decodificación segura con manejo de errores
- ✅ Limpieza automática de tokens expirados

### 2. Interceptores Axios
- ✅ Token añadido automáticamente a headers
- ✅ Manejo centralizado de errores 401
- ✅ Limpieza de sesión en errores de autenticación

### 3. Guards de Navegación
- ✅ Protección de rutas sensibles
- ✅ Redirección a login si no autenticado
- ✅ Prevención de acceso a login si ya autenticado

### 4. Almacenamiento
- ✅ Token en localStorage (persiste entre sesiones)
- ✅ Datos de usuario separados del token
- ✅ Limpieza completa en logout

---

## Buenas Prácticas Implementadas

### 1. Separación de Responsabilidades
- **Cliente HTTP**: Solo comunicación con API
- **Utils**: Lógica de JWT reutilizable
- **Composable**: Gestión de estado y lógica de negocio
- **Vistas**: Solo presentación e interacción

### 2. Composable Reutilizable
- Estado global reactivo compartido
- Un solo punto de verdad para autenticación
- Reutilizable en cualquier componente

### 3. Patrón Fachada
- Abstracción de llamadas asíncronas
- API consistente para consumidores

### 4. Manejo de Errores
- Try-catch en operaciones asíncronas
- Mensajes de error amigables al usuario
- Logs de errores en consola para debugging

### 5. UX/UI
- Estados de carga (loading)
- Deshabilitar controles durante operaciones
- Mensajes informativos de sesión expirada
- Redirección automática inteligente

### 6. Código Limpio
- Nombres descriptivos de funciones y variables
- Comentarios JSDoc en funciones clave
- Código modular y testeable
- Constantes para URLs y configuración

---

## Credenciales de Prueba

### Usuario Admin
```
Username: Ariel
Password: Elizalde
Roles: ["admin"]
```

---

## Endpoints de API

### Autenticación

**Login**
```http
POST http://localhost:8082/auth/api/v1.0/auth/login
Content-Type: application/json

{
  "username": "Ariel",
  "password": "Elizalde"
}

Response 200:
{
  "token": "eyJ0eXAi...",
  "username": "Ariel",
  "email": "marcelo-elizalde@hotmail.com",
  "roles": ["admin"],
  "enabled": true
}
```

### API de Estudiantes (Protegida)

Todos los endpoints requieren header:
```
Authorization: Bearer {token}
```

**Base URL:** `http://localhost:8081/matricula/api/v1.0/estudiantes`

- `GET /` - Consultar todos los estudiantes
- `GET /{id}` - Consultar estudiante por ID
- `POST /` - Guardar nuevo estudiante
- `PUT /{id}` - Actualizar estudiante completo
- `PATCH /{id}` - Actualizar estudiante parcial
- `DELETE /{id}` - Borrar estudiante

---

## Cómo Usar

### 1. Iniciar la aplicación
```bash
npm run serve
```

### 2. Acceder a la aplicación
```
http://localhost:8080
```

### 3. Iniciar sesión
- Navegar a "Iniciar Sesión"
- Ingresar: **Ariel** / **Elizalde**
- Click en "Iniciar Sesión"

### 4. Navegar por rutas protegidas
- Los enlaces de estudiantes aparecerán en el navbar
- Todas las peticiones incluirán el token automáticamente

### 5. Cerrar sesión
- Click en botón "Cerrar Sesión"
- Sesión limpiada completamente

---

## Pruebas Manuales Recomendadas

### Test 1: Login Exitoso
1. Ir a `/login`
2. Ingresar credenciales correctas
3. ✅ Debe redirigir a home
4. ✅ Debe mostrar nombre de usuario en navbar
5. ✅ Debe mostrar enlaces de estudiantes

### Test 2: Login Fallido
1. Ir a `/login`
2. Ingresar credenciales incorrectas
3. ✅ Debe mostrar mensaje de error
4. ✅ No debe redirigir
5. ✅ Formulario debe permanecer activo

### Test 3: Acceso a Ruta Protegida sin Auth
1. Cerrar sesión (o borrar localStorage)
2. Intentar acceder a `/estudiantes/consultar-todos`
3. ✅ Debe redirigir a `/login`
4. ✅ URL debe incluir `?redirect=...`

### Test 4: Persistencia de Sesión
1. Iniciar sesión
2. Recargar página (F5)
3. ✅ Usuario debe seguir autenticado
4. ✅ Navbar debe mostrar usuario

### Test 5: Token Expirado
1. Iniciar sesión
2. Editar localStorage: cambiar `exp` del token a fecha pasada
3. Intentar navegar a ruta protegida
4. ✅ Debe detectar expiración
5. ✅ Debe redirigir a login

### Test 6: Error 401 de API
1. Iniciar sesión
2. Borrar token de localStorage (sin recargar)
3. Hacer petición a API de estudiantes
4. ✅ API debe retornar 401
5. ✅ Interceptor debe redirigir a login
6. ✅ Debe mostrar alerta de sesión expirada

### Test 7: Logout
1. Iniciar sesión
2. Click en "Cerrar Sesión"
3. ✅ Debe redirigir a login
4. ✅ localStorage debe estar vacío
5. ✅ Enlaces de estudiantes deben ocultarse

### Test 8: Redirección Post-Login
1. Sin autenticar, ir a `/estudiantes/guardar`
2. Redirige a login con `?redirect=/estudiantes/guardar`
3. Iniciar sesión
4. ✅ Debe redirigir automáticamente a `/estudiantes/guardar`

---

## Extensiones Futuras Posibles

### 1. Refresh Token
- Implementar renovación automática de tokens
- Endpoint de refresh en API
- Lógica de renovación antes de expiración

### 2. Roles y Permisos
- Guards específicos por rol (isAdmin, isUser, etc.)
- Permisos granulares por ruta
- Ocultar botones según permisos

### 3. Recordar Sesión
- Checkbox "Recordarme"
- sessionStorage vs localStorage según elección
- Diferentes tiempos de expiración

### 4. Notificaciones
- Toast notifications en lugar de alerts
- Mensajes de éxito/error elegantes
- Integración con librerías como vue-toastification

### 5. Validaciones Avanzadas
- Validación de formato de email
- Requisitos de contraseña (longitud, caracteres, etc.)
- Mensajes de validación específicos por campo

### 6. Recuperación de Contraseña
- Flujo de "Olvidé mi contraseña"
- Envío de email con token temporal
- Vista de reseteo de contraseña

### 7. Registro de Usuarios
- Vista de registro
- Validación de datos
- Confirmación por email

### 8. Testing
- Unit tests para composable useAuth
- Unit tests para jwtHelper
- Integration tests para flujo de login
- E2E tests con Cypress

---

## Solución de Problemas

### Problema: "Tu sesión ha expirado" constantemente
**Causa:** Token con tiempo de expiración muy corto  
**Solución:** Verificar configuración de `exp` en API Quarkus

### Problema: Navbar no se actualiza después del login
**Causa:** Estado reactivo no inicializado  
**Solución:** Verificar que `initializeAuth()` se llama en `App.vue` `onMounted()`

### Problema: Peticiones HTTP sin token
**Causa:** Interceptor no configurado correctamente  
**Solución:** Verificar que interceptor está en `matriculaClient.js` antes de las funciones

### Problema: Redirección infinita a login
**Causa:** Token siempre considerado inválido  
**Solución:** Verificar lógica de `isTokenExpired()` y formato del token

### Problema: CORS en peticiones HTTP
**Causa:** API no configurada para CORS  
**Solución:** Configurar headers CORS en API Quarkus:
```java
@ConfigProperty(name = "quarkus.http.cors")
boolean cors = true;
```

---

## Conclusión

Sistema de autenticación robusto, seguro y fácil de mantener implementado con las mejores prácticas de Vue 3. La arquitectura basada en composables permite reutilización y escalabilidad sin la complejidad de una librería de gestión de estado completa como Pinia o Vuex.

El sistema está listo para producción con las siguientes características clave:
- ✅ Seguridad con JWT
- ✅ Persistencia de sesión
- ✅ Protección de rutas
- ✅ Manejo de errores robusto
- ✅ UX amigable
- ✅ Código limpio y mantenible

---

**Fecha de creación:** 4 de febrero de 2026  
**Versión de Vue:** 3.2.13  
**Versión de Vue Router:** 4.0.3  
**Versión de Axios:** 1.13.4
