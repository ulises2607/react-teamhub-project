# TeamHub frontend

Consulta [la guía del repositorio](../README.md) para ejecutar la demo, conectar una API, revisar las ramas y desplegar.

- `npm run demo`: versión local con datos en memoria (http://127.0.0.1:4173; demo / teamhub).
- `npm run dev`: versión conectada a `VITE_API_URL`.
- `npm run lint`: validación estática sin advertencias.
- `npm test`: regresiones de estado y concurrencia del chat.
- `npm run test:e2e`: recorridos de escritorio y celular con Playwright.
- `npm run build`: compilación de producción.

Requiere Node.js 22.12 o posterior. Para pruebas de navegador, instala Chromium con `npx playwright install chromium`.
