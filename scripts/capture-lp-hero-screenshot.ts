import { chromium } from 'playwright';
import sharp from 'sharp';
import path from 'path';

const APP_URL = process.env.APP_URL ?? 'http://localhost:3000';
const OUT_PATH = path.join(process.cwd(), 'public/images/lp-hero-devices.png');

const STORAGE_ENTRIES: Record<string, string> = {
  'japanese-super-words-visited': 'true',
  'japanese-super-words-intro-done': 'true',
  'japanese-super-words-username': 'Guest',
  'japanese-super-words-youtube-banner-dismissed': '1',
};

async function captureAppScreenshot(
  viewport: { width: number; height: number },
  output: string,
) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport });

  await page.addInitScript((entries) => {
    for (const [key, value] of Object.entries(entries)) {
      localStorage.setItem(key, value);
    }
  }, STORAGE_ENTRIES);

  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Choose your plan', { timeout: 30_000 });
  await page.waitForTimeout(800);

  await page.screenshot({ path: output, fullPage: false });
  await browser.close();
}

async function composeHero(desktopPath: string, mobilePath: string) {
  const canvasW = 1024;
  const canvasH = 663;

  const desktop = await sharp(desktopPath)
    .resize(720, 450, { fit: 'cover', position: 'top' })
    .png()
    .toBuffer();

  const mobile = await sharp(mobilePath)
    .resize(220, 476, { fit: 'cover', position: 'top' })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite([
      { input: desktop, left: 48, top: 72 },
      { input: mobile, left: 720, top: 120 },
    ])
    .png()
    .toFile(OUT_PATH);
}

async function main() {
  const tmpDesktop = path.join(process.cwd(), '.tmp-lp-desktop.png');
  const tmpMobile = path.join(process.cwd(), '.tmp-lp-mobile.png');

  await captureAppScreenshot({ width: 1280, height: 800 }, tmpDesktop);
  await captureAppScreenshot({ width: 390, height: 844 }, tmpMobile);
  await composeHero(tmpDesktop, tmpMobile);

  console.log(`Saved ${OUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
