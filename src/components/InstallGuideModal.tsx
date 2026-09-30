import React from 'react';
import { 
  Smartphone, 
  Download, 
  CheckCircle2, 
  Share2, 
  ExternalLink, 
  Layers, 
  Code,
  ShieldCheck,
  Check
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
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

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
              تثبيت تطبيق أندرويد (PWA & APK)
            </h2>
            <p className="text-xs text-emerald-200">
              يمكنك تشغيل هذا التطبيق على هاتفك كتطبيق أندرويد أصلي متكامل بدون إنترنت
            </p>
          </div>
        </div>
      </div>

      {/* Direct Install CTA Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 mx-auto shadow-lg shadow-indigo-500/20 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400 font-bold text-2xl">
            17×
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-white mb-1">
            تطبيق احتساب مستحق الأرشفة الذكي
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            إصدار أندرويد الرسمي متوافق مع نظام أندرويد (Android OS) وكافة الشاشات.
          </p>
        </div>

        {isInstalled ? (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>التطبيق مثبت بالفعل ويعمل بوضع التطبيق المستقل (Standalone)!</span>
          </div>
        ) : isInstallable ? (
          <button
            onClick={install}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/60 transition active:scale-95 animate-pulse"
          >
            <Download className="w-5 h-5" />
            <span>تثبيت التطبيق على هاتفك الآن بنقرة واحدة</span>
          </button>
        ) : (
          <div className="p-3 bg-indigo-950/50 border border-indigo-500/30 rounded-xl text-indigo-200 text-xs leading-relaxed text-right">
            📌 <strong>للتثبيت السريع على هاتف أندرويد:</strong> افتح الرابط في متصفح <strong>Google Chrome</strong>، ثم اضغط على زر القائمة (الثلاث نقاط ⋮) في أعلى المتصفح، واختر <strong>"تثبيت التطبيق"</strong> أو <strong>"الإضافة إلى الشاشة الرئيسية"</strong>.
          </div>
        )}
      </div>

      {/* 3 Step Android Install Visual Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>خطوات التثبيت السهل على هواتف أندرويد (Android)</span>
        </h4>

        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 num-tabular">
              1
            </span>
            <div>
              <strong className="text-white block text-sm mb-0.5">افتح المتصفح على هاتفك</strong>
              <span className="text-slate-400">
                قم بفتح رابط التطبيق على هاتفك عبر متصفح Google Chrome أو أي متصفح أندرويد حديث.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 num-tabular">
              2
            </span>
            <div>
              <strong className="text-white block text-sm mb-0.5">اختر خيار التثبيت</strong>
              <span className="text-slate-400">
                انقر على قائمة المتصفح (⋮) ثم اضغط على خيار <span className="text-emerald-400 font-bold">"تثبيت التطبيق" (Install App)</span> أو "إضافة إلى الشاشة الرئيسية".
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 num-tabular">
              3
            </span>
            <div>
              <strong className="text-white block text-sm mb-0.5">تم التثبيت بنجاح</strong>
              <span className="text-slate-400">
                سيظهر التطبيق كأيقونة أصلية في قائمة تطبيقات هاتفك الأندرويد، ويعمل بدون شريط المتصفح وبدون إنترنت (Offline).
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Build & Package Information for the User */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Code className="w-4 h-4 text-amber-400" />
          <span>ملف البناء وحزم APK (Android APK Build)</span>
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          تم تهيئة ملفات البناء الرسمية بنجاح عبر Vite و PWA Manifest وأيقونات عالية الدقة. 
          مجلد البناء الإنتاجي <code className="text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded">dist/</code> يتم توليده تلقائياً بالأمر:
        </p>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 text-left dir-ltr select-all">
          npm run build
        </div>

        <p className="text-[11px] text-slate-400">
          يمكنك تحويل التطبيق أيضاً إلى ملف <strong className="text-slate-200">APK</strong> مباشر لنشره على متجر جوجل بلاي باستخدام أدوات مثل <strong>PWABuilder</strong> أو <strong>Bubblewrap CLI</strong> عبر إدخال رابط التطبيق.
        </p>
      </div>
    </div>
  );
};
