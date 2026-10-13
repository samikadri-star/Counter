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
      monoLabel: 'CALC',
      arabicLabel: 'احتساب الأجور',
      icon: Calculator,
      badge: null,
    },
    {
      id: 'names' as const,
      monoLabel: 'USERS',
      arabicLabel: 'إدارة الأسماء',
      icon: Users,
      badge: namesCount > 0 ? namesCount : null,
    },
    {
      id: 'history' as const,
      monoLabel: 'ARCHV',
      arabicLabel: 'سجل الترحيل',
      icon: Archive,
      badge: batchesCount > 0 ? batchesCount : null,
    },
    {
      id: 'install' as const,
      monoLabel: 'BUILD',
      arabicLabel: 'ملف البناء',
      icon: DownloadCloud,
      badge: 'APK',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#F8F7F4] border-t-2 border-[#111113] pb-safe shadow-[0_-4px_0px_rgba(17,17,19,0.06)]">
      <div className="max-w-md mx-auto grid grid-cols-4 h-16 items-center px-1.5 divide-x-2 divide-[#111113] divide-x-reverse">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full relative transition-all duration-150 ${
                isActive
                  ? 'bg-[#111113] text-white'
                  : 'bg-transparent text-[#111113] hover:bg-[#FFF9F2]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'scale-110 text-[#E35E2D]' : 'text-[#111113]'
                  }`}
                />
                {tab.badge !== null && (
                  <span
                    className={`absolute -top-1.5 -right-3 font-mono text-[8px] px-1 rounded font-black num-tabular border leading-tight ${
                      isActive
                        ? 'bg-[#E35E2D] text-white border-white'
                        : 'bg-[#111113] text-white border-[#111113]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-center mt-1">
                <span className="font-mono text-[9px] font-bold tracking-widest leading-none">
                  {tab.monoLabel}
                </span>
                <span className="text-[10px] font-bold leading-tight mt-0.5">
                  {tab.arabicLabel}
                </span>
              </div>
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#E35E2D]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
