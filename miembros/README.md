# VENDE EN AUTOMÁTICO VIP

Área de miembros privada del curso "Vende en Automático VIP" — sistema de ventas de productos digitales con WhatsApp, IA y Meta Ads.

## Estado actual

**Fase 1 (MVP visual navegable):** sistema de diseño + login premium + layout responsive (sidebar escritorio / menú inferior móvil) + dashboard tipo streaming + cursos/módulos/clases + reproductor con progreso + ruta de implementación (8 fases) + biblioteca + notificaciones + progreso/insignias. Datos de demostración en `src/lib/data.ts`.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + lucide-react
- PostgreSQL + Prisma (pendiente conectar)
- Supabase Auth (pendiente)
- Bunny Stream para video (pendiente)
- Resend para correos (pendiente)
- Hotmart webhooks (pendiente, Fase 5)

## Ejecutar local

```bash
npm install
npm run dev
# abre http://localhost:3000
```

## Estructura

```
src/app/
├── login/            → Login premium
├── (app)/            → Área autenticada
│   ├── inicio/       → Dashboard tipo streaming
│   ├── cursos/       → Catálogo, curso, módulo
│   ├── clases/[id]/  → Reproductor + progreso + notas
│   ├── mi-ruta/      → Ruta de 8 fases
│   ├── biblioteca/   → Biblioteca infinita
│   └── ...           → Resto de secciones
src/components/       → UI, layout, tarjetas
src/lib/data.ts       → Datos de demostración
```

## Configuración

Copiar `.env.example` → `.env.local` y completar credenciales según la fase en curso.

## Despliegue (Coolify)

1. Crear servicio Docker con el Dockerfile (se añadirá en Fase 7).
2. Definir variables de entorno.
3. Ejecutar migraciones de Prisma.
4. Configurar dominio + HTTPS automático.
5. Conectar webhook de Hotmart a `/api/webhooks/hotmart`.

## Accesos demo

- `demo-nuevo@vende.com` — sin progreso
- `demo-progreso@vende.com` — 37% de progreso
- `demo-completo@vende.com` — curso completo

Documento de arquitectura completo: `miembros/docs/ARQUITECTURA.md`.
