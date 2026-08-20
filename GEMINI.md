# Reglas de Trabajo para angelbazan.com

## Despliegue Automático & Control de Versiones

- **Siempre realizar Git Commit y Git Push**:
  Cada vez que se completen o modifiquen archivos de código, estilos (CSS), scripts (JS) o contenido HTML en este proyecto, DEBES realizar automáticamente los siguientes comandos:
  1. `git add .`
  2. `git commit -m "<descripción clara del cambio>"`
  3. `git push origin main`
  Esto es obligatorio para que **Cloudflare Pages** construya y despliegue los cambios en vivo inmediatamente.

- **Limpieza de Caché (Cache-Busting)**:
  Al actualizar hojas de estilo `styles.css` u otros assets, asegura incluir/actualizar el parámetro de versión `assets/styles.css?v=X.X` en los archivos HTML correspondientes para evitar que los navegadores muestren versiones antiguas en caché.
