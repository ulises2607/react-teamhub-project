import { createServer } from 'vite';
import { createDemoApi } from './demo-api.mjs';
const api = await createDemoApi(4174);
const vite = await createServer({ mode: 'demo', server: { host: '127.0.0.1', port: 4173, strictPort: true }, define: { 'import.meta.env.VITE_API_URL': JSON.stringify('http://127.0.0.1:4174') } });
await vite.listen();
console.log('TeamHub demo: http://127.0.0.1:4173 · usuario: demo · contraseña: teamhub');
const stop = async () => { await vite.close(); api.close(); process.exit(0); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
