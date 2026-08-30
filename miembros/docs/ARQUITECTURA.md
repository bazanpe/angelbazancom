# VENDE EN AUTOMÁTICO VIP — Arquitectura

Área de miembros privada para el curso "Vende en Automático VIP" (venta de productos digitales con WhatsApp + IA + Meta Ads).

---

## 1. ARQUITECTURA DE INFORMACIÓN

```
VENDE EN AUTOMÁTICO VIP
├── Pre-autenticación
│   ├── /login              → Login + recuperación de contraseña
│   ├── /onboarding         → Onboarding de 4 pasos (objetivo, nivel, ruta)
│   └── /acceso             → Estado de activación (webhook Hotmart)
├── Aprendizaje (alumno)
│   ├── /inicio             → Dashboard tipo streaming
│   ├── /mi-ruta            → Ruta de 8 fases de implementación
│   ├── /cursos             → Catálogo de cursos
│   ├── /cursos/[curso]     → Detalle de curso
│   ├── /cursos/[curso]/[modulo] → Detalle de módulo + lista de clases
│   ├── /clases/[clase]     → Reproductor + recursos + checklist + notas
│   └── /biblioteca         → Biblioteca infinita (filtros, favoritos)
├── Comunidad
│   ├── /comunidad          → Publicaciones (resultados)
│   ├── /resultados         → Resultados de alumnos (aprobados/destacados)
│   ├── /calendario         → Mentorías, clases en vivo, auditorías
│   ├── /mentorias          → Mentorías y grabaciones
│   └── /ranking            → Ranking semanal/mensual (desactivable)
├── Cuenta
│   ├── /notificaciones     → Centro de notificaciones
│   ├── /mi-progreso        → Progreso total, insignias, racha
│   ├── /perfil             → Datos, contraseña, sesiones, privacidad
│   ├── /soporte            → FAQ, tickets, WhatsApp
│   └── /configuracion      → Preferencias
├── Administración (protegida, /admin/*)
│   ├── /admin/dashboard    → Métricas de la plataforma
│   ├── /admin/alumnos      → Gestión de estudiantes
│   ├── /admin/contenido    → Cursos, módulos, clases (drag & drop)
│   ├── /admin/biblioteca   → Recursos y categorías
│   ├── /admin/eventos      → Mentorías y en vivo
│   ├── /admin/resultados   → Aprobación y moderación
│   ├── /admin/notificaciones → Envío segmentado
│   ├── /admin/webhooks     → Revisión/reproceso de webhooks
│   ├── /admin/ventas       → Compras, accesos, reembolsos
│   └── /admin/config       → Marca, integraciones, seguridad
└── Legales
    ├── /terminos
    ├── /privacidad
    ├── /cookies
    ├── /reembolso
    ├── /uso-permitido
    └── /aviso-resultados
```

## 2. MAPA DE PÁGINAS (MVP)

| Página | Ruta | Rol |
|---|---|---|
| Login | `/login` | Público |
| Onboarding | `/onboarding` | Estudiante nuevo |
| Dashboard | `/inicio` | Estudiante |
| Mi ruta | `/mi-ruta` | Estudiante |
| Catálogo | `/cursos` | Estudiante |
| Curso | `/cursos/[id]` | Estudiante |
| Módulo | `/cursos/[id]/[modulo]` | Estudiante |
| Clase | `/clases/[id]` | Estudiante |
| Biblioteca | `/biblioteca` | Estudiante |
| Resultados | `/resultados` | Estudiante |
| Notificaciones | `/notificaciones` | Estudiante |
| Perfil | `/perfil` | Estudiante |
| Soporte | `/soporte` | Estudiante |
| Admin dashboard | `/admin` | Admin+ |
| Admin alumnos | `/admin/alumnos` | Admin, Soporte |
| Admin contenido | `/admin/contenido` | Admin, Editor, Instructor |
| Admin webhooks | `/admin/webhooks` | Superadmin |

## 3. FLUJOS DEL ESTUDIANTE

**Compra → Acceso (Hotmart):**
1. Compra en Hotmart → Hotmart envía webhook `PURCHASE_APPROVED`.
2. Webhook validado (firma HMAC) → evento idempotente (`webhook_events`).
3. Buscar usuario por correo; si no existe, se crea con contraseña temporal.
4. Se asigna `products` + `plans` + `user_access` (Activo, fecha vencimiento).
5. Se envía correo de bienvenida + enlace para crear contraseña.
6. El alumno inicia sesión → onboarding (objetivo/nivel) → ruta personalizada.

**Estudio:**
1. Dashboard muestra "Tu siguiente paso" (hero) + carruseles.
2. Abre clase → reproductor guarda progreso (`lesson_progress` con segundo de pausa, velocidad).
3. Al superar el % configurado → clase completada → puntos, racha, insignias.
4. Al completar todas las clases de un módulo → módulo completado → siguiente módulo desbloqueado (si la liberación lo exige).
5. "Mi ruta" refleja el avance por fase + checklist de implementación.

**Acceso bloqueado:**
- Mostrar qué contiene, por qué está bloqueado, cómo desbloquearlo (mejora de plan) — nunca errores técnicos.

## 4. FLUJOS ADMINISTRATIVOS

**Crear contenido:** Admin/Editor crea curso → módulos (drag & drop) → clases (video, miniatura, recursos, checklist, progreso requerido) → publicación programada → preview como estudiante.

**Gestión de alumno:** Buscar → ver progreso/sesiones/compras → asignar/quitar acceso → extender vencimiento → resetear contraseña → suspender → notas internas → exportar CSV.

**Webhook fallido:** Panel de webhooks lista eventos fallidos con payload y error → reenviar o reprocesar (idempotente).

## 5. MODELO DE DATOS (PostgreSQL + Prisma)

Entidades (de la especificación #25) con relación:

```
users 1—1 profiles
users N—M roles (user_roles)
roles 1—N permissions (N—M role_permissions)
plans N—M products (plan_products)
products 1—N purchases
users 1—N purchases
purchases 1—1 subscriptions
users 1—N user_access (plan_id, status, expires_at)
courses 1—N modules 1—N lessons
lessons 1—N lesson_resources
lessons N—M categories
library_resources 1—1 categories
users 1—N enrollments (course_id)
users 1—N lesson_progress (lesson_id, position, speed, completed_at)
module_progress / course_progress (derivables, calculadas en servidor)
learning_paths 1—N learning_path_steps
checklists 1—N checklist_items N—M user_checklist_progress
users 1—N notes (lesson_id)
users 1—N favorites
achievements 1—N user_achievements
users 1—N points_history
users 1—1 streaks
events 1—N event_attendees
users 1—N notifications / notification_reads
community_posts 1—N comments / reactions
users 1—N support_tickets
webhook_events (payload, status, error, processed_at, idempotency_key UNIQUE)
integrations, audit_logs, active_sessions, platform_settings
```

Reglas: `lesson_progress` único por (user, lesson); `idempotency_key` único en `webhook_events`; borrado lógico (`deleted_at`) en contenido; progreso calculado en servidor (no confiar en frontend).

## 6. ROLES Y PERMISOS (backend real)

| Rol | Alcance |
|---|---|
| SUPERADMIN | Todo + configuración + webhooks |
| ADMIN | Alumnos, ventas, accesos, notificaciones |
| EDITOR | Contenido + biblioteca (no facturación) |
| INSTRUCTOR | Solo sus propios cursos |
| SOPORTE | Ver alumnos, tickets, resetear contraseña (no borrar contenido) |
| MODERADOR | Aprobar resultados, moderar comentarios |
| ESTUDIANTE | Solo su contenido asignado |

Los permisos se validan en servidor (middleware Next.js + checks en cada action), nunca solo ocultando botones.

## 7. PLAN TÉCNICO

- **Frontend/Backend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui.
- **Base de datos:** PostgreSQL + Prisma ORM (migraciones versionadas).
- **Auth:** Supabase Auth (o Auth.js con credenciales + JWT) — sesiones HttpOnly/Secure, refresh tokens.
- **Video:** Bunny Stream (recomendado: sin reproductor público, progreso y control) o Vimeo privado.
- **Correo:** Resend (transaccionales: bienvenida, reset, vencimiento, webhooks).
- **Webhooks Hotmart:** API route `POST /api/webhooks/hotmart` con firma HMAC + idempotencia + cola Redis/BullMQ.
- **Almacenamiento:** S3 compatible (Bunny CDN/S3 o Cloudflare R2) con URLs firmadas.
- **Colas/caché:** Redis (BullMQ para webhooks y correos; caché de consultas).
- **Despliegue:** Docker + Docker Compose + Coolify (dominio propio, HTTPS automático).
- **Analítica:** respetando privacidad (eventos propios, sin trackers invasivos).

## 8. ESTRUCTURA DE COMPONENTES

```
app/
├── (auth)/login, (auth)/onboarding
├── (app)/inicio, mi-ruta, cursos, clases, biblioteca, resultados, ...
├── (admin)/admin/...
├── api/webhooks/hotmart, api/auth/..., api/progress/..., api/library/...
components/
├── ui/       (button, card, input, dialog, tabs, badge, ...)
├── layout/   (sidebar, topbar, mobile-nav, header)
├── player/   (video-player, playbar, speed-menu, subtitles)
├── cards/    (course-card, lesson-card, resource-card, event-card, result-card)
├── ruta/     (phase-card, checklist, path-map)
├── charts/   (progress-ring, bars)
├── gamification/ (badge, streak, points, confetti)
├── library/  (filters, resource-detail)
└── shared/   (skeleton, empty-state, error-boundary, confirm-dialog)
```

## 9. PRIORIDADES DEL MVP

**MVP (Fase 1–3):**
1. Auth + roles + onboarding (4 pasos) + layout responsive (sidebar escritorio, menú inferior móvil).
2. Dashboard tipo streaming (hero + resumen personal + carruseles principales).
3. Cursos/módulos/clases + reproductor (progreso real, velocidad, completado, "IMPLEMENTA AHORA", notas).
4. Mi ruta (8 fases, checklist, insignias).
5. Biblioteca infinita (búsqueda, filtros, descargas, favoritos).
6. Notificaciones + perfil + soporte básico.
7. Admin: contenido + alumnos + accesos.

**MVP+ (Fase 4–5):** Webhook Hotmart + accesos automáticos + correos + panel webhooks + auditoría.

**V2 (Fase 6–7):** Comunidad (resultados, comentarios, reacciones), gamificación completa + ranking, calendario/mentorías con Google Calendar, seguridad avanzada, rendimiento y despliegue en Coolify.

## 10. SEGURIDAD

- Contraseñas con bcrypt/argon2; cookies HttpOnly+Secure+SameSite.
- CSRF, rate limiting (auth + webhooks), validación y sanitización de entradas.
- Webhooks verificados con HMAC; idempotencia por clave de transacción.
- URLs firmadas para archivos privados; límite de dispositivos activos; cierre remoto de sesiones.
- Backups automáticos + restauración documentada; secretos solo en variables de entorno.

## DATOS DE DEMOSTRACIÓN

- `demo-nuevo@vende.com` (sin progreso), `demo-progreso@vende.com` (37%), `demo-completo@vende.com` (100%).
- Contenido del curso completo (15 módulos), recursos, eventos, notificaciones e insignias en español latinoamericano.
