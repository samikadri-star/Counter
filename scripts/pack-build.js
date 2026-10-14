import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function packBuild() {
  const distDir = path.resolve('dist');
  const androidDir = path.resolve('android');
  const publicDir = path.resolve('public');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  function addFolderToZip(folderPath, zipFolder, excludeSubstrings = []) {
    if (!fs.existsSync(folderPath)) return;
    const items = fs.readdirSync(folderPath);
    for (const item of items) {
      if (excludeSubstrings.some((ex) => item.includes(ex))) continue;
      const fullPath = path.join(folderPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const subFolder = zipFolder.folder(item);
        addFolderToZip(fullPath, subFolder, excludeSubstrings);
      } else {
        const fileContent = fs.readFileSync(fullPath);
        zipFolder.file(item, fileContent);
      }
    }
  }

  // 1. Package Web Build (dist/)
  if (fs.existsSync(distDir)) {
    console.log('Packaging dist folder into ZIP...');
    const zip = new JSZip();
    addFolderToZip(distDir, zip, ['build.zip', 'android-kotlin-project.zip']);

    const readmeContent = `# تطبيق احتساب مستحق الأرشفة الذكي
تصميم وتطوير: سامي القادري 777484160

## محتويات حزمة الويب
1. index.html
2. assets/
3. manifest.webmanifest
4. sw.js
`;
    zip.file('README.txt', readmeContent);

    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
    });

    fs.writeFileSync(path.join(publicDir, 'build.zip'), zipBuffer);
    fs.writeFileSync(path.join(distDir, 'build.zip'), zipBuffer);
    fs.writeFileSync(path.resolve('build.zip'), zipBuffer);
    console.log(`Successfully created build.zip (${(zipBuffer.length / 1024).toFixed(2)} KB)`);
  }

  // 2. Package Native Kotlin Android Studio Project (android/)
  if (fs.existsSync(androidDir)) {
    console.log('Packaging native Kotlin Android project into ZIP...');
    const kotlinZip = new JSZip();
    addFolderToZip(androidDir, kotlinZip, ['.gradle', 'build', '.idea']);

    const kotlinReadme = `# مشروع تطبيق أندرويد الأصلي بلغة كوتلن (Kotlin)
تطبيق احتساب مستحق الأرشفة الذكي
تصميم وتطوير: سامي القادري 777484160

## كيفية تشغيل المشروع وتوليد ملف APK:
1. افتح برنامج Android Studio.
2. اختر "Open an Existing Project" وحدد هذا المجلد.
3. اضغط من القائمة العلوية على: Build -> Build Bundle(s) / APK(s) -> Build APK(s).
4. سيتولد ملف APK الأصلي فوراً في مسار:
   app/build/outputs/apk/debug/app-debug.apk
`;
    kotlinZip.file('README_KOTLIN.txt', kotlinReadme);

    const kotlinZipBuffer = await kotlinZip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
    });

    fs.writeFileSync(path.join(publicDir, 'android-kotlin-project.zip'), kotlinZipBuffer);
    if (fs.existsSync(distDir)) {
      fs.writeFileSync(path.join(distDir, 'android-kotlin-project.zip'), kotlinZipBuffer);
    }
    fs.writeFileSync(path.resolve('android-kotlin-project.zip'), kotlinZipBuffer);
    console.log(`Successfully created android-kotlin-project.zip (${(kotlinZipBuffer.length / 1024).toFixed(2)} KB)`);
  }
}

packBuild().catch((err) => {
  console.error('Error packing build:', err);
  process.exit(1);
});
