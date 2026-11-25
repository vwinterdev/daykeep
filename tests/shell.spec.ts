import { expect, test } from '@playwright/test'

for (const [width, height] of [[320, 600], [390, 844], [768, 800], [1440, 900]]) {
  test(`панель и прокрутка на ${width} px`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Обзор' })).toBeVisible()
    const shell = await page.locator('.app-shell').boundingBox()
    const nav = page.getByRole('navigation')
    const header = page.getByRole('banner')
    const before = await nav.boundingBox()
    const headerBefore = await header.boundingBox()
    expect(shell).toEqual(width <= 480
      ? { x: 0, y: 0, width, height }
      : { x: (width - 430) / 2, y: 16, width: 430, height: height - 32 })
    await expect(nav.getByRole('link')).toHaveCount(4)
    for (const link of await nav.getByRole('link').all()) {
      const box = (await link.boundingBox())!
      expect(box.x).toBeGreaterThanOrEqual(shell!.x)
      expect(box.x + box.width).toBeLessThanOrEqual(shell!.x + shell!.width)
      expect(box.y + box.height).toBeLessThanOrEqual(shell!.y + shell!.height)
    }
    const main = page.getByRole('main')
    const financeShortcut = main.getByRole('link', { name: /Финансы/ })
    await main.evaluate((element) => element.scrollTo(0, element.scrollHeight))
    await expect(financeShortcut).toBeInViewport({ ratio: 1 })
    expect(await nav.boundingBox()).toEqual(before)
    expect(await header.boundingBox()).toEqual(headerBefore)
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(height)
  })
}

test('прямой адрес, четыре вкладки, история, перезагрузка и ленивый экран аккаунта', async ({ page }) => {
  const requests: string[] = []
  page.context().on('request', (request) => requests.push(request.url()))
  await page.goto('/#/calendar')
  const nav = page.getByRole('navigation')
  await expect(nav.getByRole('link', { name: 'Календарь' })).toHaveAttribute('aria-current', 'page')
  for (const title of ['Клиенты', 'Финансы', 'Обзор']) {
    await nav.getByRole('link', { name: title }).click()
    await expect(page.getByRole('heading', { name: title })).toBeVisible()
  }
  await page.goBack()
  await expect(page).toHaveURL(/#\/finances$/)
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Финансы' })).toBeVisible()
  expect(requests.every((url) => url.startsWith('http://127.0.0.1:4173/'))).toBe(true)
  expect(requests.some((url) => /Account-|supabase/i.test(url))).toBe(false)
  await page.getByRole('link', { name: 'Аккаунт' }).click()
  await expect(page.getByRole('heading', { name: 'Подключите Supabase' })).toBeVisible()
  expect(requests.some((url) => url.includes('/assets/Account-'))).toBe(true)
})

test('файлы PWA доступны; оболочка запускается заново без сети', async ({ page, context, request }) => {
  const manifest = await request.get('/manifest.webmanifest')
  expect(manifest.ok()).toBe(true)
  const { icons } = await manifest.json() as { icons: { src: string }[] }
  expect(icons).toHaveLength(2)
  for (const { src } of icons) {
    const icon = await request.get(src)
    expect(icon.ok()).toBe(true)
    expect(icon.headers()['content-type']).toContain('image/png')
  }
  const favicon = await request.get('/icons/journal.svg')
  expect(favicon.headers()['content-type']).toContain('image/svg+xml')
  const worker = await request.get('/sw.js')
  expect(worker.ok()).toBe(true)
  expect(worker.headers()['content-type']).toContain('javascript')

  await page.goto('/')
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null)
  const cached = await page.evaluate(async () => {
    const [key] = await caches.keys()
    return (await (await caches.open(key)).keys()).map((request) => new URL(request.url).pathname)
  })
  expect(cached).toContain('/index.html')
  expect(cached.some((path) => /Account-|supabase|\/auth\/|\/rest\//i.test(path))).toBe(false)
  await context.setOffline(true)
  await page.close()
  const offline = await context.newPage()
  await offline.goto('/#/calendar')
  await expect(offline.getByRole('heading', { name: 'Календарь', level: 1 })).toBeVisible()
  await offline.getByRole('navigation').getByRole('link', { name: 'Финансы' }).click()
  await offline.reload()
  await expect(offline.getByRole('heading', { name: 'Финансы' })).toBeVisible()
})
