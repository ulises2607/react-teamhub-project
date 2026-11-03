import { test, expect } from '@playwright/test';
const api = 'http://127.0.0.1:4174';
async function login(page) {
  await page.goto('/login');
  await page.getByLabel('Usuario', { exact: true }).fill('demo');
  await page.getByLabel('Contraseña', { exact: true }).fill('teamhub');
  await page.getByRole('button', { name: 'Entrar a TeamHub' }).click();
  await expect(page).toHaveURL(/\/main$/);
}
async function menu(page) {
  const button = page.getByRole('button', { name: 'Abrir menú', exact: true });
  if (await button.isVisible()) await button.click();
}
async function channel(page, name = 'general') {
  await menu(page);
  await page.getByRole('button', { name: 'Estudio Creativo', exact: true }).click();
  await page.getByRole('button', { name: name, exact: true }).click();
  await expect(page.getByRole('heading', { name: `# ${name}`, exact: true })).toBeVisible();
}
test.beforeEach(async ({ request }) => { await request.get(`${api}/__reset`); });

test('private routes redirect and malformed stored sessions do not crash', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('tokennn', '{broken'));
  await page.goto('/profile');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByLabel('Usuario', { exact: true })).toBeVisible();
});

test('failed login allows retry, logout protects browser history', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Usuario', { exact: true }).fill('demo');
  await page.getByLabel('Contraseña', { exact: true }).fill('incorrect');
  await page.getByRole('button', { name: 'Entrar a TeamHub' }).click();
  await expect(page.getByRole('alert')).toContainText('incorrectos');
  await expect(page.getByRole('button', { name: 'Entrar a TeamHub' })).toBeEnabled();
  await login(page); await menu(page);
  await page.getByRole('button', { name: /Alex Rivera/ }).click();
  await page.getByRole('button', { name: 'Cerrar sesión' }).click();
  await page.goto('/main');
  await expect(page).toHaveURL(/\/login$/);
});

test('chat preserves failed drafts, sends, deletes, and switches channels without overflow', async ({ page }) => {
  await login(page); await channel(page);
  await expect(page.getByText('Dejé un canal de ideas', { exact: false })).toBeVisible();
  const input = page.getByLabel('Mensaje para #general', { exact: true });
  await page.route('**/teamhub/messages/', async (route) => {
    if (route.request().method() === 'POST') await route.fulfill({ status: 500, json: { detail: 'Error de prueba al enviar' } });
    else await route.continue();
  });
  await input.fill('Mi mensaje de prueba');
  await page.getByRole('button', { name: 'Enviar', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Error de prueba');
  await expect(input).toHaveValue('Mi mensaje de prueba');
  await expect(page.getByText('Dejé un canal de ideas', { exact: false })).toBeVisible();
  await page.unroute('**/teamhub/messages/');
  await page.getByRole('button', { name: 'Enviar', exact: true }).click();
  await expect(input).toHaveValue('');
  const article = page.getByRole('article').filter({ hasText: 'Mi mensaje de prueba' });
  await expect(article).toBeVisible();
  await article.getByRole('button', { name: /Eliminar mensaje/ }).click();
  await expect(article).toHaveCount(0);
  await channel(page, 'ideas');
  await expect(page.getByText('La conversación empieza con vos.', { exact: false })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.screenshot({ path: `test-results/chat-${test.info().project.name}.png`, fullPage: true });
});

test('server form keeps data on API failure and creates successfully on retry', async ({ page }) => {
  await login(page); await menu(page);
  await page.getByRole('button', { name: 'Crear servidor', exact: true }).first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByLabel('Nombre del servidor').fill('Nuevo equipo');
  await page.route('**/teamhub/servers/', async (route) => {
    if (route.request().method() === 'POST') await route.fulfill({ status: 400, json: { name: ['No se pudo guardar el nombre.'] } });
    else await route.continue();
  });
  await dialog.getByRole('button', { name: 'Crear servidor', exact: true }).click();
  await expect(dialog.getByRole('alert')).toContainText('No se pudo guardar');
  await expect(dialog.getByLabel('Nombre del servidor')).toHaveValue('Nuevo equipo');
  await page.unroute('**/teamhub/servers/');
  await dialog.getByRole('button', { name: 'Crear servidor', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Nuevo equipo', exact: true })).toBeVisible();
});

test('channel creation and rename stay usable, deleting selected channel clears chat', async ({ page }) => {
  await login(page); await menu(page);
  await page.getByRole('button', { name: 'Estudio Creativo', exact: true }).click();
  await page.getByRole('button', { name: 'Crear canal', exact: true }).click();
  await page.getByLabel('Nuevo canal', { exact: true }).fill('planificacion');
  await page.getByRole('button', { name: 'Guardar', exact: true }).click();
  await expect(page.getByRole('button', { name: 'planificacion', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Opciones de planificacion' }).click();
  await page.getByRole('button', { name: 'Renombrar', exact: true }).click();
  await page.getByLabel('Renombrar canal', { exact: true }).fill('proyectos');
  await page.getByRole('button', { name: 'Guardar', exact: true }).click();
  await page.getByRole('button', { name: 'proyectos', exact: true }).click();
  await menu(page);
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Opciones de proyectos' }).click();
  await page.getByRole('button', { name: 'Eliminar canal' }).click();
  await expect(page.getByRole('heading', { name: 'proyectos', exact: true })).not.toBeVisible();
});

test('direct profile load and failed save preserve edits', async ({ page }) => {
  await login(page); await page.goto('/profile');
  await page.getByLabel('Nombre', { exact: true }).fill('Lucía');
  await page.route('**/users/profiles/profile_data/', async (route) => {
    if (route.request().method() === 'PATCH') await route.fulfill({ status: 400, json: { detail: 'No se pudo guardar el perfil.' } });
    else await route.continue();
  });
  await page.getByRole('button', { name: 'Guardar cambios' }).click();
  await expect(page.getByRole('alert')).toContainText('No se pudo guardar');
  await expect(page.getByLabel('Nombre', { exact: true })).toHaveValue('Lucía');
  await page.unroute('**/users/profiles/profile_data/');
  await page.getByRole('button', { name: 'Guardar cambios' }).click();
  await expect(page).toHaveURL(/\/main$/);
  await menu(page); await expect(page.getByText('Lucía Rivera', { exact: true })).toBeVisible();
});

test('explore finds communities and joins a server', async ({ page }) => {
  await login(page); await page.goto('/explore-servers');
  await page.getByLabel('Buscar servidores').fill('React');
  await expect(page.getByRole('heading', { name: 'Comunidad React', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Estudio Creativo', exact: true })).not.toBeVisible();
  await page.getByRole('button', { name: 'Unirse al servidor' }).click();
  await expect(page).toHaveURL(/\/main$/);
  await menu(page); await expect(page.getByRole('button', { name: 'Comunidad React', exact: true })).toBeVisible();
});

test('expired API session returns to login', async ({ page }) => {
  await login(page);
  await page.route('**/users/profiles/profile_data/', (route) => route.fulfill({ status: 401, json: { detail: 'Sesión vencida.' } }));
  await page.goto('/profile');
  await expect(page).toHaveURL(/\/login$/);
});


test('missing author profiles do not hide messages or duplicate a successful send', async ({ page }) => {
  await login(page);
  await page.route('**/users/profiles/1/', (route) => route.fulfill({ status: 404, json: { detail: 'Perfil no disponible' } }));
  await page.route('**/users/profiles/2/', (route) => route.fulfill({ status: 404, json: { detail: 'Perfil no disponible' } }));
  await channel(page);
  await expect(page.getByRole('article')).toHaveCount(3);
  await page.getByLabel('Mensaje para #general', { exact: true }).fill('Mensaje sin perfil');
  await page.getByRole('button', { name: 'Enviar', exact: true }).click();
  await expect(page.getByRole('article').filter({ hasText: 'Mensaje sin perfil' })).toHaveCount(1);
  await expect(page.getByLabel('Mensaje para #general', { exact: true })).toHaveValue('');
});
