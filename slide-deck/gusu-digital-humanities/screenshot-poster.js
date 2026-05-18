const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const posterPath = path.resolve(__dirname, '../../academic-poster.html');
  const outputPath = path.resolve(__dirname, '../../academic-poster.png');
  const pdfPath = path.resolve(__dirname, '../../academic-poster.pdf');

  // A0 at 150dpi ≈ 4961 x 7016 px
  const width = 4961;
  const height = 7016;

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 2715, deviceScaleFactor: 2 });

  await page.goto('file:///' + posterPath.replace(/\\/g, '/'), {
    waitUntil: 'networkidle0',
    timeout: 60000
  });

  // Wait for fonts to load
  await new Promise(r => setTimeout(r, 3000));

  // Screenshot as PNG
  await page.screenshot({
    path: outputPath,
    fullPage: true,
    type: 'png'
  });

  console.log('PNG saved:', outputPath);

  // Also export as PDF
  await page.pdf({
    path: pdfPath,
    width: '841mm',
    height: '1189mm',
    printBackground: true,
    preferCSSPageSize: true
  });

  console.log('PDF saved:', pdfPath);

  await browser.close();
})();
