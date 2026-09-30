import React, { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  CheckCircle2, 
  Share2, 
  ExternalLink, 
  Layers, 
  Code,
  ShieldCheck,
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

  const handleOpenDirect = () => {
    window.open(directUrl, '_blank');
  };

  return (
    <div className="space-y-4 pb-28 pt-2">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/30 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              ملف البناء وتثبيت أندرويد (Build & Install)
            </h2>
            <p className="text-xs text-emerald-200">
              قم بتحميل حزمة البناء الجاهزة أو تثبيت التطبيق على جهازك
            </p>
          </div>
        </div>
      </div>

      {/* Primary Action Card: Download Build ZIP */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/50 rounded-2xl p-5 shadow-2xl space-y-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 p-2 mx-auto flex items-center justify-center shadow-lg shadow-emerald-950/50">
          <FileArchive className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/40 mb-2 inline-block">
            الحزمة الإنتاجية المجمعة جاهزة
          </span>
          <h3 className="text-lg font-black text-white">
            تحميل ملف الـ Build المجمع (ZIP)
          </h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto mt-1 leading-relaxed">
            يحتوي ملف <strong className="text-emerald-300">build.zip</strong> على كامل ملفات التطبيق المبنية والجاهزة للتشغيل المباشر، أو الرفع على الاستضافة، أو التحويل إلى ملف <strong>APK</strong>.
          </p>
        </div>

        {/* Big Download Button */}
        <button
          onClick={handleDownloadBuildZip}
          className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/70 border border-emerald-400/40 active:scale-[0.98] transition cursor-pointer"
        >
          <Download className="w-5 h-5 text-white" />
          <span>{downloadingZip ? 'جاري بدء التحميل...' : 'تحميل حزمة البناء build.zip (350 KB)'}</span>
        </button>

        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>جاهز للأندرويد</span>
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>يعمل بدون إنترنت (Offline)</span>
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>يشمل الأيقونات والمانفيست</span>
          </span>
        </div>
      </div>

      {/* Why couldn't install from browser explanation & Solution */}
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h4>لماذا لم يظهر زر التثبيت في المتصفح؟ وكيفية تفعيله:</h4>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          متصفحات أندرويد (مثل Chrome) تمنع التثبيت التلقائي عندما يتم فتح التطبيق داخل <strong>إطار المعاينة (IFrame)</strong> أو داخل محادثة الذكاء الاصطناعي.
          <br />
          لحل ذلك وتثبيته مباشرة على هاتفك:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleOpenDirect}
            className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition active:scale-95"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>فتح في نافذة متصفح مستقلة</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition active:scale-95"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">تم نسخ الرابط المباشر!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>نسخ الرابط لفتحه في Chrome</span>
              </>
            )}
          </button>
        </div>

        {/* In-app install button if available */}
        {isInstallable && (
          <div className="pt-2">
            <button
              onClick={install}
              className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>تثبيت التطبيق الآن على هذا الجهاز</span>
            </button>
          </div>
        )}
      </div>

      {/* How to turn build.zip into native APK file */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
          <Code className="w-4 h-4 text-amber-400" />
          <span>خطوات تحويل ملف الـ Build إلى تطبيق APK بصيغة أندرويد (.apk)</span>
        </h4>
        
        <div className="space-y-2.5 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <strong className="text-white block">الطريقة الأولى: عبر أداة PWABuilder الرسمية (بدون برمجة)</strong>
            <p className="text-slate-400">
              1. انسخ رابط التطبيق المباشر، أو ارفع محتويات ملف <code className="text-cyan-300">build.zip</code> على أي استضافة سريعة (مثل Netlify مجاناً).<br />
              2. افتح موقع <a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-semibold">PWABuilder.com</a> والصق الرابط.<br />
              3. اضغط على زر <strong className="text-emerald-400">"Generate Android Package"</strong>، وسيقوم الموقع بتوليد ملف <strong>APK</strong> و <strong>AAB</strong> جاهز للتثبيت على أي هاتف فوراً أو النشر في Google Play.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <strong className="text-white block">الطريقة الثانية: التثبيت المباشر من Chrome (أسهل وأسرع طريقة)</strong>
            <p className="text-slate-400">
              افتح الرابط في Google Chrome على هاتفك الأندرويد، واضغط على الثلاث نقاط (⋮) في الأعلى ثم اختر <strong>"تثبيت التطبيق"</strong>. سيتثبت التطبيق فوراً كأي تطبيق أندرويد عادي دون الحاجة لملف APK!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
