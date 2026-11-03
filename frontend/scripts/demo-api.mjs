import { createServer } from 'node:http';

export function createDemoApi(port = 4174) {
  let state;
  const reset = () => {
    state = {
      profile: { user__id: 1, username: 'demo', first_name: 'Alex', last_name: 'Rivera', email: 'alex@example.com', profile_state: 'En línea' },
      servers: [{ id: 1, name: 'Estudio Creativo', description: 'Ideas, diseño y proyectos que construimos juntos.', owner: 1, members: [1, 2], icon: null }, { id: 2, name: 'Comunidad React', description: 'Un lugar para aprender y compartir lo que estamos creando.', owner: 2, members: [2], icon: null }],
      channels: [{ id: 1, server: 1, name: 'general' }, { id: 2, server: 1, name: 'ideas' }],
      messages: [{ id: 1, channel: 1, author: 2, content: '¡Bienvenido al equipo! Este es nuestro espacio para compartir ideas y mantenernos conectados.', created_at: '2026-11-03T12:30:00Z' }, { id: 2, channel: 1, author: 1, content: 'Me encanta. ¿Qué les parece si empezamos por organizar los próximos pasos?', created_at: '2026-11-03T12:32:00Z' }, { id: 3, channel: 1, author: 2, content: 'Dejé un canal de ideas listo para lo que viene ✨', created_at: '2026-11-03T12:33:00Z' }],
    };
  };
  reset();
  const server = createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') { res.writeHead(204).end(); return; }
    const reply = (code, value) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(value === undefined ? undefined : JSON.stringify(value)); };
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    if (url.pathname === '/__reset') { reset(); reply(200, { ok: true }); return; }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    let data = {};
    if (body.length) {
      if (req.headers['content-type']?.includes('multipart/form-data')) {
        const form = await new Request(url, { method: 'POST', headers: { 'Content-Type': req.headers['content-type'] }, body }).formData();
        data = Object.fromEntries([...form].filter(([, value]) => typeof value === 'string'));
      } else { try { data = JSON.parse(body); } catch { reply(400, { detail: 'Datos inválidos.' }); return; } }
    }
    if (url.pathname === '/api-auth/') {
      if (data.username === 'demo' && data.password === 'teamhub') reply(200, { token: 'demo-local-token' });
      else reply(400, { non_field_errors: ['Usuario o contraseña incorrectos.'] });
      return;
    }
    if (req.headers.authorization !== 'Token demo-local-token') { reply(401, { detail: 'Sesión vencida.' }); return; }
    if (url.pathname === '/users/profiles/profile_data/') {
      if (req.method === 'PATCH') Object.assign(state.profile, data);
      reply(200, state.profile); return;
    }
    if (url.pathname.startsWith('/users/profiles/')) {
      const id = Number(url.pathname.split('/')[3]);
      reply(200, id === 1 ? state.profile : { user__id: 2, first_name: 'Sofía', last_name: 'Torres' }); return;
    }
    if (url.pathname === '/teamhub/members/' && req.method === 'POST') {
      const server = state.servers.find((item) => item.id === data.server);
      if (!server) { reply(404, { detail: 'Servidor no encontrado.' }); return; }
      if (!server.members.includes(1)) server.members.push(1);
      reply(201, { server: data.server, user: 1 }); return;
    }
    const match = url.pathname.match(/^\/teamhub\/(servers|channels|messages)\/(?:(\d+)\/?)?$/);
    if (!match) { reply(404, { detail: 'No encontrado.' }); return; }
    const [, collection, rawId] = match;
    const items = state[collection];
    const id = Number(rawId);
    if (req.method === 'GET') {
      let filtered = items;
      for (const field of ['channel', 'server']) if (url.searchParams.has(field)) filtered = filtered.filter((item) => item[field] === Number(url.searchParams.get(field)));
      if (url.searchParams.get('search')) filtered = filtered.filter((item) => item.name.toLowerCase().includes(url.searchParams.get('search').toLowerCase()));
      reply(200, { count: filtered.length, next: null, results: filtered }); return;
    }
    if (req.method === 'POST') {
      const item = { ...data, id: Math.max(0, ...items.map((item) => item.id)) + 1 };
      if (collection === 'messages') Object.assign(item, { author: 1, created_at: new Date().toISOString() });
      if (collection === 'servers') Object.assign(item, { owner: 1, members: [1], icon: null });
      items.push(item); reply(201, item); return;
    }
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) { reply(404, { detail: 'No encontrado.' }); return; }
    if (req.method === 'DELETE') { items.splice(index, 1); reply(204); return; }
    if (req.method === 'PATCH') { Object.assign(items[index], data); reply(200, items[index]); return; }
    reply(405, { detail: 'Método no permitido.' });
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}
