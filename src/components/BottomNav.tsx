import React from 'react';
import { Calculator, Users, Archive, DownloadCloud } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'calculator' | 'names' | 'history' | 'install';
  setActiveTab: (tab: 'calculator' | 'names' | 'history' | 'install') => void;
  namesCount: number;
  batchesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  namesCount,
  batchesCount,
}) => {
  const tabs = [
    {
      id: 'calculator' as const,
      label: 'احتساب الأجور',
      icon: Calculator,
      badge: null,
    },
    {
      id: 'names' as const,
      label: 'إدارة الأسماء',
      icon: Users,
      badge: namesCount > 0 ? namesCount : null,
    },
    {
      id: 'history' as const,
      label: 'سجل الترحيل',
      icon: Archive,
      badge: batchesCount > 0 ? batchesCount : null,
    },
    {
      id: 'install' as const,
      label: 'تثبيت أندرويد',
      icon: DownloadCloud,
      badge: 'PWA',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 pb-safe shadow-2xl">
      <div className="max-w-md mx-auto grid grid-cols-4 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full relative transition-all duration-200 ${
                isActive
                  ? 'text-cyan-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-cyan-400' : 'text-slate-400'
                  }`}
                />
                {tab.badge !== null && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 text-[9px] px-1 rounded-full font-bold num-tabular leading-tight ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight truncate max-w-[80px]">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
