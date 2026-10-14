import React, { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  CheckCircle2, 
  Layers, 
  Code, 
  Check, 
  Copy, 
  FileArchive, 
  ArrowUpRight, 
  Sparkles 
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  const directUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleDownloadBuildZip = () => {
    setDownloadingZip(true);
    const link = document.createElement('a');
    link.href = '/build.zip';
    link.download = 'archive-wage-app-build.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadingZip(false), 2000);
  };

  const handleDownloadKotlinZip = () => {
    const link = document.createElement('a');
    link.href = '/android-kotlin-project.zip';
    link.download = 'archive-wage-calculator-kotlin-android.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenDirect = () => {
    window.open(directUrl, '_blank');
  };

  return (
    <div className="space-y-4 pb-28 pt-2">
      {/* Top Banner (Variation 1 Style) */}
      <div className="brutal-card p-4 flex items-center justify-between">
        <div>
          <div className="label-mono text-[#E35E2D]">[04] NATIVE KOTLIN & BUILD // APK</div>
          <h2 className="text-base sm:text-lg font-black text-[#111113]">
            كود كوتلن (Kotlin) وملفات البناء
          </h2>
        </div>
        <div className="font-mono text-xs font-black bg-[#111113] text-white px-2 py-0.5">
          KOTLIN_READY
        </div>
      </div>

      {/* Primary Action Card: Download Native Kotlin Project */}
      <div className="brutal-card-tint p-5 sm:p-6 text-center space-y-4">
        <div className="w-16 h-16 bg-[#111113] text-white border-2 border-[#111113] shadow-[3px_3px_0px_#E35E2D] flex items-center justify-center mx-auto">
          <FileArchive className="w-8 h-8 text-[#E35E2D]" />
        </div>

        <div>
          <span className="label-mono bg-white border border-[#111113] px-2 py-0.5 inline-block mb-1 text-[#E35E2D]">
            100% NATIVE KOTLIN ANDROID
          </span>
          <h3 className="text-lg font-black text-[#111113]">
            مشروع تطبيق أندرويد الأصلي بلغة كوتلن (Kotlin)
          </h3>
          <p className="text-xs text-[#111113]/70 max-w-md mx-auto mt-1 leading-relaxed">
            تم تحويل وبرمجة التطبيق بالكامل بلغة <strong className="text-[#E35E2D]">Kotlin</strong> الأصلية (MainActivity.kt، واجهات XML الأصلية، محرك تصدير PDF، وحفظ محلي).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Kotlin Project Download */}
          <button
            onClick={handleDownloadKotlinZip}
            className="brutal-btn-accent w-full py-3.5 px-3 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-white" />
            <span>تحميل مشروع كوتلن لأندرويد ستوديو (ZIP)</span>
          </button>

          {/* Web / PWA Build Download */}
          <button
            onClick={handleDownloadBuildZip}
            className="brutal-btn-secondary w-full py-3.5 px-3 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تحميل حزمة الويب المبنية (build.zip)</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-[11px] text-[#111113]/70 pt-1">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#E35E2D]" />
            <span>STANDALONE READY</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#E35E2D]" />
            <span>OFFLINE SW INCLUDED</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#E35E2D]" />
            <span>ALL ICONS 512PX</span>
          </span>
        </div>
      </div>

      {/* Direct Chrome Install Options */}
      <div className="brutal-card p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2 border-b-2 border-[#111113] pb-2">
          <Sparkles className="w-4 h-4 text-[#E35E2D]" />
          <h4 className="label-mono text-[#111113] font-black">
            تثبيت التطبيق مباشرة على هاتف أندرويد عبر Chrome
          </h4>
        </div>

        <p className="text-xs text-[#111113]/80 leading-relaxed">
          لتثبيت التطبيق على هاتفك بدون ملف APK، افتح الرابط في نافذة متصفح Chrome مستقلة (خارج إطار المعاينة)، ثم اضغط على الثلاث نقاط (⋮) في المتصفح واختر <strong>"تثبيت التطبيق"</strong>:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleOpenDirect}
            className="brutal-btn py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4 text-[#E35E2D]" />
            <span>فتح في نافذة متصفح مستقلة</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="brutal-btn-secondary py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-[#E35E2D]" />
                <span>تم نسخ الرابط المباشر!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>نسخ الرابط لفتحه في Chrome</span>
              </>
            )}
          </button>
        </div>

        {isInstallable && (
          <div className="pt-2">
            <button
              onClick={install}
              className="brutal-btn-accent w-full py-2.5 px-3 text-xs font-black flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>تثبيت التطبيق الآن على هذا الجهاز</span>
            </button>
          </div>
        )}
      </div>

      {/* APK Conversion Guide */}
      <div className="brutal-card p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2 border-b-2 border-[#111113] pb-2">
          <Code className="w-4 h-4 text-[#E35E2D]" />
          <h4 className="label-mono text-[#111113] font-black">
            تحويل حزمة build.zip إلى ملف أندرويد APK
          </h4>
        </div>

        <div className="space-y-2 text-xs text-[#111113]/80 leading-relaxed">
          <div className="bg-[#FFF9F2] border-2 border-[#111113] p-3 space-y-1">
            <strong className="block font-bold text-[#111113]">1. عبر GitHub Actions (توليد APK تلقائي):</strong>
            <p>
              تم تضمين مشروع أندرويد الأصلي في مجلد <code className="font-mono text-[#E35E2D]">android/</code> وضبط ملف <code className="font-mono text-[#E35E2D]">.github/workflows/Build.yml</code>. بمجرد رفع التغييرات إلى GitHub، سيقوم السيرفر بتشغيل Gradle وبناء ملف <strong>Archive-Wage-App-APK (.apk)</strong> تلقائياً وستجده جاهزاً للتحميل في تبويب <strong>Actions</strong> داخل مستودعك!
            </p>
          </div>

          <div className="bg-[#FFF9F2] border-2 border-[#111113] p-3 space-y-1">
            <strong className="block font-bold text-[#111113]">2. عبر أداة PWABuilder (مجاناً بدون برمجة):</strong>
            <p>
              1. استخرج ملف <code className="font-mono text-[#E35E2D]">build.zip</code> وارفعه على أي استضافة مجانية أو استخدم رابط التطبيق المباشر.<br />
              2. افتح موقع <a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" className="text-[#E35E2D] font-bold underline">PWABuilder.com</a> والصق الرابط.<br />
              3. اضغط "Generate Android APK" لتحميل ملف <strong>APK</strong> فوري جاهز للتثبيت على أي هاتف!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
