# Oportunidades de Mejora y Mantenimiento

> **Sistema:** HMC Inventory Management System  
> **Fecha de Análisis:** 31 de Enero 2026  
> **Alcance:** Cambios factibles en 3 días laborales

---

## 📊 Resumen Ejecutivo

| Criticidad | Cantidad | Tiempo Est. |
|------------|----------|-------------|
| 🔴 **Alta** | 3 | 1.5 días |
| 🟠 **Media** | 4 | 1 día |
| 🟢 **Baja** | 2 | 0.5 días |

---

## 🔴 CRITICIDAD ALTA

| # | Tipo | Problema | Ubicación | Recomendación | Tiempo |
|---|------|----------|-----------|---------------|--------|
| 1 | **Correctivo** | El `verification_token` se expone en la respuesta JSON cuando falla el envío del email de verificación, permitiendo interceptación de datos sensibles. | [authController.js L42-54](file:///c:/Users/Usuario/Desktop/Mantenimiento_Sistema_Inventario/Proyecto_Original/backend/controllers/authController.js#L42-L54) | Eliminar `verification_token` de la respuesta. Crear endpoint `/api/auth/resend-verification` para reenvío seguro. | 2h |
| 2 | **Correctivo** | Las rutas `/api/test` están montadas incondicionalmente, exponiendo funcionalidades de prueba en producción. | [server.js L16, L46](file:///c:/Users/Usuario/Desktop/Mantenimiento_Sistema_Inventario/Proyecto_Original/backend/server.js#L16) | Condicionar montaje: `if (process.env.NODE_ENV !== 'production') { app.use('/api/test', testRoutes); }` | 0.5h |
| 3 | **Preventivo** | No se valida stock suficiente antes de ventas. `quantity - $1` puede generar inventario negativo. | [saleModel.js L30-34](file:///c:/Users/Usuario/Desktop/Mantenimiento_Sistema_Inventario/Proyecto_Original/backend/models/saleModel.js#L30-L34) | Agregar validación: `if (currentStock < quantity) { throw new Error('Stock insuficiente'); }` | 1h |

---

## 🟠 CRITICIDAD MEDIA

| # | Tipo | Problema | Ubicación | Recomendación | Tiempo |
|---|------|----------|-----------|---------------|--------|
| 4 | **Perfectivo** | Problema N+1: se ejecuta una consulta por cada producto para obtener variantes, afectando rendimiento. | [productController.js L16-21](file:///c:/Users/Usuario/Desktop/Mantenimiento_Sistema_Inventario/Proyecto_Original/backend/controllers/productController.js#L16-L21) | Usar única consulta con JOIN o subconsulta con `array_agg()` de PostgreSQL. | 3h |
| 5 | **Preventivo** | `ssl: { rejectUnauthorized: false }` desactiva verificación SSL, permitiendo ataques MITM en conexiones a BD. | [database.js L11](file:///c:/Users/Usuario/Desktop/Mantenimiento_Sistema_Inventario/Proyecto_Original/backend/config/database.js#L11) | Configurar SSL según entorno. Agregar variable `DB_SSL_REJECT_UNAUTHORIZED` para control explícito. | 1h |
| 6 | **Correctivo** | CORS acepta único origen fijo. Falla con múltiples frontends o subdominios. | [server.js L24-27](file:///c:/Users/Usuario/Desktop/Mantenimiento_Sistema_Inventario/Proyecto_Original/backend/server.js#L24-L27) | Permitir múltiples orígenes via `ALLOWED_ORIGINS` separados por comas con validación dinámica. | 2h |
| 7 | **Adaptativo** | `isStaff` e `isAuthenticated` son idénticos. Lógica de roles duplicada y no centralizada. | [auth.js L22-27](file:///c:/Users/Usuario/Desktop/Mantenimiento_Sistema_Inventario/Proyecto_Original/backend/middleware/auth.js#L22-L27) | Consolidar en función factory: `requireRole(...roles)` que maneje todos los casos. | 2h |

---

## 🟢 CRITICIDAD BAJA

| # | Tipo | Problema | Ubicación | Recomendación | Tiempo |
|---|------|----------|-----------|---------------|--------|
| 8 | **Perfectivo** | Mensajes de error genéricos ("Server error") sin códigos ni identificadores, dificultan debugging. | [/backend/controllers/](file:///c:/Users/Usuario/Desktop/Mantenimiento_Sistema_Inventario/Proyecto_Original/backend/controllers/) | Implementar sistema de códigos: `{ code: 'ERR_AUTH_001', message: '...', details: ... }` | 3h |
| 9 | **Preventivo** | Endpoints de autenticación sin rate limiting, vulnerables a ataques de fuerza bruta. | [authRoutes.js](file:///c:/Users/Usuario/Desktop/Mantenimiento_Sistema_Inventario/Proyecto_Original/backend/routes/authRoutes.js) | Implementar `express-rate-limit`: 5 intentos por 15 minutos en `/login`, `/register`. | 1.5h |

---

## 📋 Plan de Implementación - 3 Días

| Día | Tareas | Criticidad | Horas |
|-----|--------|------------|-------|
| **1** | Corregir exposición token + Condicionar rutas test + Validación stock + Config SSL + Middleware roles | Alta + Media | 6.5h |
| **2** | Optimizar N+1 productos + CORS múltiples orígenes + Rate limiting | Media + Baja | 6.5h |
| **3** | Sistema códigos error + Pruebas integración finales | Baja | 4h |

---

> [!NOTE]
> Cada mejora debe tener su correspondiente test automatizado para validar la corrección.
