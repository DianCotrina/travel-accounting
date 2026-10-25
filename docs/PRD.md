# PRD — Sacatucuenta (travel-accounting)

| Campo | Valor |
|---|---|
| Estado | Borrador v1 — describe el MVP existente y define preguntas abiertas |
| Versión de referencia | `v0.1.0` (rama `main`) |
| Última actualización | 2026-10-25 |
| Documentos relacionados | `DEVELOPMENT_PLAN.md`, `docs/backend-design-structure.md`, `docs/workflow-diagram.md` |

> Convención: las preguntas abiertas se marcan como **[Q-n]** y se listan en la sección 9 con responsable y si bloquean.

---

## 1. Resumen

Sacatucuenta es una aplicación web para registrar gastos de viaje **mientras ocurren**, en la moneda local del destino, y ver su equivalente en la moneda de origen del viajero (USD primero). El resultado son registros categorizados, resúmenes contables y exportaciones CSV listas para reembolsos y contabilidad.

No es un software contable ni una app de presupuesto personal: es la capa de **captura y contexto de moneda** que alimenta esos procesos.

## 2. Problema

- Los viajeros reconstruyen sus gastos al volver, a partir de recibos, capturas y memoria. Los registros llegan incompletos y tarde.
- Convertir moneda local a moneda de origen se hace a mano, con tipos de cambio inconsistentes y sin trazabilidad de qué tasa se usó.
- Finanzas recibe planillas heterogéneas, lo que genera idas y vueltas y retrasa reembolsos y cierres de mes.

Ejemplo de referencia: un usuario estadounidense en Argentina registra gastos en ARS (Uber, almuerzo, museo, snacks) y necesita saber su impacto en USD.

> La evidencia de este problema hoy es supuesta (copy de landing). Ver **[Q-1]**.

## 3. Usuarios objetivo

| Persona | Necesidad principal | Estado en producto |
|---|---|---|
| **Viajero individual / nómada digital** | Diario contable de viaje: todo categorizado y exportable a fin de mes. | Cubierto por el MVP. |
| **Viajero de negocios / consultor** | Entregar a finanzas un resumen limpio el mismo día para su reembolso. | Cubierto parcialmente (CSV sí; sin flujo de envío/aprobación). |
| **Finanzas / aprobador de equipo** | Revisar gastos de varios viajeros con contexto de moneda y auditoría. | **No cubierto**: no existen equipos ni roles. Ver **[Q-4]**. |

## 4. Objetivos

**Usuario**
1. Registrar un gasto en el momento en pocos segundos, en moneda local.
2. Ver el equivalente en moneda de origen de cada gasto y del viaje sin calcular a mano.
3. Obtener un resumen/CSV utilizable por finanzas sin limpieza manual.

**Negocio**
4. Validar que viajeros completan viajes con registros útiles (activación y retención).
5. Validar disposición a pagar por los planes Pro/Team (ver **[Q-3]**).

Las métricas concretas están en la sección 8.

## 5. No-objetivos (v1)

- **Reemplazar software contable** (asientos, impuestos, conciliación bancaria): fuera del foco declarado del producto.
- **Presupuesto personal / ahorro**: el producto se posiciona para reembolso y contabilidad, no finanzas personales.
- **Gestión de reservas o itinerarios**: adyacente pero otra categoría de producto.
- **Pagos o tarjetas corporativas integradas**: alta complejidad y requisitos regulatorios; prematuro.
- **Apps móviles nativas**: la web responsive es el canal v1 (ver P1 de captura móvil).

## 6. Estado actual del producto (MVP existente)

Todo lo siguiente está implementado en `v0.1.0` (`main`).

### 6.1 Viajes
- Crear, editar, listar y archivar viajes.
- Cada viaje tiene destino, rango de fechas, moneda de origen y moneda local.
- Endpoints: `GET/POST /api/trips`, `GET/PUT /api/trips/{id}`, `POST /api/trips/{id}/archive`.

### 6.2 Gastos
- Alta, edición, listado y baja de gastos dentro de un viaje.
- Campos: categoría, monto, moneda, fecha, notas.
- Categorías actuales (backend): Transport, Meal, TouristActivity, Museum, Snack, Lodging, Other. Ver **[Q-2]**.
- Catálogo de países de referencia: AR, US, BR, CL, MX, CO (`GET /api/reference/countries`).

### 6.3 Tipos de cambio y conversión
- Un tipo de cambio por viaje, día y par de monedas.
- Si falta, se obtiene automáticamente de exchangerate.host y se guarda.
- Cada gasto expone `homeAmount`, `homeCurrency` y `exchangeRateUsed` (trazabilidad de la tasa usada).
- Si el proveedor falla, el gasto **se guarda igual** y queda sin convertir (`homeAmount = null`), visible en la UI.
- Redondeo: 2 decimales, `MidpointRounding.AwayFromZero`. Ver **[Q-7]**.

### 6.4 Resumen contable (ledger)
- Por viaje: totales en moneda local y de origen, por categoría y por día.
- Conteo de gastos convertidos vs. pendientes de conversión.
- Endpoint: `GET /api/trips/{tripId}/ledger/summary`.

### 6.5 Reportes y exportación
- Resumen filtrable por rango de fechas y categoría.
- Exportación CSV.
- Endpoints: `GET /api/trips/{tripId}/reports/summary`, `GET /api/trips/{tripId}/reports/export/csv`.

### 6.6 Usuarios, aislamiento y auditoría
- API protegida con JWT bearer; cada usuario solo accede a sus propios viajes y gastos.
- Auditoría inmutable de cambios sensibles (crear/editar/borrar gastos, crear viajes, actualizar tipos de cambio) con antes/después en JSON.
- Endpoint: `GET /api/audit` con filtros por entidad, usuario y fechas. **Sin UI** todavía.

### 6.7 Frontend
- Landing de marketing: propuesta de valor, cómo funciona, planes, testimonios, FAQ, contacto.
- Modal de login y dashboard con viajes, gastos, tasas, ledger y reportes.

### 6.8 Plataforma
- Persistencia en PostgreSQL (EF Core + migraciones); docker-compose para desarrollo local.
- CI con build, tests, lint y type-check.

### 6.9 Problemas conocidos (verificados en código)

| # | Problema | Impacto |
|---|---|---|
| K-1 | El dashboard llama rutas que el backend no expone: `/api/countries` (real: `/api/reference/countries`), `/api/trips/{id}/ledger` (real: `.../ledger/summary`), `/api/trips/{id}/report` y `.../report/csv` (real: `.../reports/summary` y `.../reports/export/csv`). | Países, ledger, reportes y CSV probablemente fallan con 404 en el dashboard. **Bloqueante para cualquier lanzamiento.** |
| K-2 | El login acepta cualquier email/contraseña no vacíos y usa un JWT fijo de entorno (`VITE_AUTH_BEARER_TOKEN`). Los botones de Google/Apple/passkey son solo visuales. | No hay identidad real; todos los usuarios comparten el mismo token. Ver **[Q-5]**. |
| K-3 | Las estadísticas (12,480+ viajes, 1.8M gastos, 84 países) y los testimonios de la landing son contenido de relleno. | Riesgo de credibilidad/legal si se publica. Ver **[Q-9]**. |
| K-4 | Las categorías de la landing (Food & Drinks, Shopping, Housing, Transportation, Vehicle… con subcategorías) no coinciden con las del backend. | Promesa de producto distinta a lo que el usuario puede registrar. Ver **[Q-2]**. |
| K-5 | `SupportedCurrencies` está configurado solo con USD y ARS, mientras el catálogo de países incluye BRL, CLP, MXN, COP. | Viajes a otros destinos pueden fallar validación. Ver **[Q-6]**. |

## 7. Requisitos para la siguiente versión

### P0 — Imprescindible antes de lanzar a usuarios reales

**R-1. Dashboard funcional end-to-end (resuelve K-1)**
- [ ] Países, ledger, reportes y CSV cargan sin errores desde el dashboard.
- [ ] Existe al menos un test que cubre cada llamada del dashboard contra la ruta real del backend.

**R-2. Identidad real (resuelve K-2)**
- Dado un usuario nuevo, cuando se registra e inicia sesión, entonces recibe un token propio y solo ve sus datos.
- [ ] Credenciales inválidas muestran un error claro; no se crea sesión.
- [ ] Los métodos de login visibles en la UI funcionan o se retiran.
- Depende de **[Q-5]**.

**R-3. Catálogo de categorías único (resuelve K-4)**
- [ ] Landing, formulario de gasto, ledger, reportes y CSV usan el mismo catálogo.
- [ ] Gastos existentes se migran sin pérdida de datos.
- Depende de **[Q-2]**.

**R-4. Monedas soportadas coherentes (resuelve K-5)**
- [ ] Todo país seleccionable tiene su moneda soportada para crear viajes y convertir.
- [ ] El redondeo respeta los decimales de cada moneda (ver **[Q-7]**).

**R-5. Contenido de landing veraz (resuelve K-3)**
- [ ] No se publican cifras ni testimonios no verificables.

### P1 — Mejora significativa, seguimiento rápido

**R-6. Captura rápida móvil**
- [ ] Registrar un gasto desde un teléfono en ≤ 3 interacciones tras abrir el viaje activo, con fecha de hoy y moneda local por defecto.

**R-7. Corrección manual de tipo de cambio**
- [ ] El usuario puede fijar o corregir la tasa de un día; el cambio queda auditado y recalcula totales.
- [ ] Gastos sin conversión ofrecen una acción para resolverla.

**R-8. Vista de auditoría**
- [ ] El usuario ve el historial de cambios de un viaje/gasto (quién, cuándo, antes/después).

**R-9. Conciliación de discrepancias** (prometido en el roadmap)
- [ ] El ledger señala gastos sin convertir, tasas atípicas o días sin gastos dentro del viaje. Alcance exacto en **[Q-8]**.

### P2 — Consideraciones futuras (diseñar para no bloquearlas)

- **Equipos y aprobaciones (plan Team):** organizaciones, roles viajero/aprobador, envío y aprobación de reportes. Implica que la propiedad de datos no sea solo por usuario.
- **Planes y cobro:** límites por plan, prueba gratis, facturación (ver **[Q-3]**).
- **Recibos:** foto/adjunto por gasto y, eventualmente, extracción automática.
- **Monedas de origen distintas a USD** como caso de primera clase.
- **Exportaciones adicionales:** PDF, formatos de herramientas contables.

## 8. Métricas de éxito

> Requiere instrumentación de analítica, inexistente hoy. Ver **[Q-10]**. Los objetivos son hipótesis iniciales a validar.

**Indicadores adelantados (semanas)**

| Métrica | Definición | Objetivo inicial |
|---|---|---|
| Activación | % de registrados que crean un viaje y ≥ 3 gastos en 7 días | ≥ 40% |
| Captura en el momento | % de gastos registrados el mismo día de su fecha | ≥ 60% |
| Cobertura de conversión | % de gastos con `homeAmount` resuelto | ≥ 95% |
| Tasa de error | % de solicitudes del dashboard con 4xx/5xx | < 1% |

**Indicadores rezagados (meses)**

| Métrica | Definición | Objetivo inicial |
|---|---|---|
| Viajes completos | % de viajes con exportación CSV generada | ≥ 30% |
| Retención | % de usuarios que crean un segundo viaje en 90 días | ≥ 25% |
| Conversión a pago | % de usuarios activos en Pro/Team | Definir con **[Q-3]** |

## 9. Preguntas abiertas

| ID | Pregunta | Responsable | ¿Bloquea? |
|---|---|---|---|
| Q-1 | ¿Qué evidencia real del problema existe (entrevistas, usuarios piloto)? ¿Cuál es el segmento inicial prioritario: viajero individual o viajero de negocios? | Producto | Sí (prioridad) |
| Q-2 | ¿Cuál es el catálogo definitivo de categorías? ¿Se usan subcategorías? ¿Cómo se migran las actuales? | Producto + Ingeniería | Sí (R-3) |
| Q-3 | ¿Qué incluye cada plan (Starter/Pro/Team)? ¿Qué límites aplica Starter? ¿Cuándo se implementa el cobro? | Producto / Negocio | No para v1 gratuita |
| Q-4 | ¿El plan Team entra en la próxima versión? ¿Qué roles y flujo de aprobación necesita finanzas? | Producto | No |
| Q-5 | ¿Quién emite la identidad: proveedor externo (Auth0, Entra, Clerk…) o auth propia? ¿Qué métodos (email, Google, Apple, passkey) son v1? | Ingeniería + Producto | Sí (R-2) |
| Q-6 | ¿Qué países y monedas se soportan en lanzamiento? | Producto | Sí (R-4) |
| Q-7 | ¿Se adopta redondeo por decimales ISO 4217 de cada moneda (p. ej. CLP 0 decimales) y una regla única compartida en dominio? | Ingeniería | Sí (R-4) |
| Q-8 | ¿Qué es una "discrepancia" para el usuario y qué acción toma ante ella? | Producto + Diseño | No |
| Q-9 | ¿Se reemplazan estadísticas y testimonios por contenido real o se retiran hasta tenerlo? | Producto / Legal | Sí (R-5) |
| Q-10 | ¿Qué herramienta de analítica se usa y qué eventos se instrumentan? | Ingeniería + Datos | No (pero sin ella no se miden las métricas) |
| Q-11 | La conversión hoy puede llamar al proveedor externo durante un `GET` de gastos. ¿Se acepta, o la tasa se resuelve al crear/editar el gasto o en un proceso aparte? | Ingeniería | No |
| Q-12 | ¿Plan de proveedor de tipos de cambio (costo, límites de exchangerate.host, alternativa de respaldo)? | Ingeniería | No |

## 10. Plan de entregas sugerido

1. **Estabilización (P0):** R-1 primero (sin él el dashboard no sirve), luego R-4/R-5; R-2 y R-3 tras resolver Q-5 y Q-2.
2. **Piloto cerrado:** usuarios reales con instrumentación (Q-10) para medir activación y captura en el momento.
3. **Iteración (P1):** captura móvil, corrección de tasas, vista de auditoría, conciliación.
4. **Monetización y equipos (P2):** según resultados del piloto y respuestas a Q-3/Q-4.

Dependencias externas: proveedor de identidad (Q-5), proveedor de tipos de cambio (Q-12), herramienta de analítica (Q-10).
