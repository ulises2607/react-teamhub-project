# TeamHub

Aplicación React para organizar equipos en servidores y canales y conversar por texto. Frontend con Redux Toolkit, React Router y Tailwind; API externa configurable. El directorio `backend` conserva el proyecto Rails original y no es el servidor usado por este frontend.

## Ver la versión de revisión

Requiere Node.js 22.12 o posterior.

```sh
cd frontend
npm ci
npm run demo
```

Abre http://127.0.0.1:4173. Usuario **demo**, contraseña **teamhub**. La demo usa una API local en el puerto 4174 con datos de ejemplo en memoria: no escribe en el servicio real. Los cambios desaparecen al reiniciar. No es un servidor para producción.

## Conectar una API real

En `frontend`, copia `.env.example` a `.env.local`, configura `VITE_API_URL` con una API compatible y ejecuta `npm run dev`. La URL no debe incluir una barra final. El servicio original (`sandbox.academiadevelopers.com`) no resolvió DNS en el entorno de revisión el 3 de noviembre de 2026. No se verificaron credenciales ni operaciones reales en ese servicio.

```sh
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Las pruebas de navegador arrancan su propia demo y cubren escritorio y celular. La integración continua ejecuta lint, pruebas de estado, compilación y recorridos de navegador.

## Ramas de trabajo

Las ramas son acumulativas para poder revisar cada etapa:

1. `codex/improve-chat-reliability`: borradores, estados separados y respuestas fuera de orden.
2. `codex/auth-and-forms`: rutas privadas, errores de login, cierre de sesión, API compartida y formularios que esperan el resultado.
3. `codex/responsive-workspace`: navegación móvil, diseño, formularios de canales y correcciones de lint.
4. `codex/teamhub-review`: integración final, demo, pruebas, actualizaciones de dependencias y documentación.

La rama `dev` permanece como base de revisión. No se publicó ni se fusionó automáticamente la versión nueva.

## Despliegue

Compila desde `frontend` con `npm run build`; los archivos quedan en `frontend/dist`. Configura `VITE_API_URL` antes de compilar. Vercel puede usar `frontend` como directorio raíz; `frontend/vercel.json` permite abrir rutas como `/main` y `/profile` directamente.

## Autores

Cesar Ulises Cappa Subelza y Rodrigo Eduardo Gonza.
