import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function packBuild() {
  const distDir = path.resolve('dist');
  if (!fs.existsSync(distDir)) {
    console.error('dist directory does not exist! Please run npm run build first.');
    process.exit(1);
  }

  const zip = new JSZip();

  function addFolderToZip(folderPath, zipFolder) {
    const items = fs.readdirSync(folderPath);
    for (const item of items) {
      if (item === 'build.zip') continue; // Avoid including itself
      const fullPath = path.join(folderPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const subFolder = zipFolder.folder(item);
        addFolderToZip(fullPath, subFolder);
      } else {
        const fileContent = fs.readFileSync(fullPath);
        zipFolder.file(item, fileContent);
      }
    }
  }

  console.log('Packaging dist folder into ZIP...');
  addFolderToZip(distDir, zip);

  // Also include a helpful README inside the zip with instructions
  const readmeContent = `# تطبيق احتساب مستحق الأرشفة الذكي
تصميم وتطوير: سامي القادري 777484160

## محتويات حزمة البناء (Build Package)
هذه الحزمة جاهزة للتشغيل المباشر أو التحويل إلى تطبيق أندرويد (APK):
1. index.html: الصفحة الرئيسية للتطبيق.
2. assets: ملفات الجافاسكربت والتنسيقات المجمعة والمحسنة.
3. manifest.webmanifest: ملف تعريف تطبيق أندرويد PWA.
4. sw.js: ملف Service Worker للتشغيل بدون إنترنت (Offline).
5. الأيقونات: أيقونات أندرويد بدقة 192x192 و 512x512 و Maskable.

## كيفية تشغيل التطبيق محلياً:
- يمكنك فتح الملف عبر أي خادم ويب مثل Live Server في VS Code، أو استضافته على Netlify / Vercel / Firebase Hosting مجاناً بنقرة واحدة.

## كيفية تحويله إلى ملف APK مباشر لأجهزة أندرويد:
1. ارفع هذا المجلد على أي استضافة (مثل Netlify أو GitHub Pages مجاناً).
2. افتح موقع: https://www.pwabuilder.com
3. ضع رابط موقعك واضغط "Start" ثم اختر "Generate Android APK".
4. سيتم تنزيل ملف APK جاهز للتثبيت على أي هاتف أندرويد!
`;
  zip.file('README.txt', readmeContent);

  const zipBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Save in public/build.zip so Vite can serve it
  fs.writeFileSync(path.join(publicDir, 'build.zip'), zipBuffer);
  // Also save in dist/build.zip for current production build
  fs.writeFileSync(path.join(distDir, 'build.zip'), zipBuffer);
  // Also save in root directory
  fs.writeFileSync(path.resolve('build.zip'), zipBuffer);

  const sizeKb = (zipBuffer.length / 1024).toFixed(2);
  console.log(`Successfully created build.zip (${sizeKb} KB) in /public, /dist, and root!`);
}

packBuild().catch((err) => {
  console.error('Error packing build:', err);
  process.exit(1);
});
