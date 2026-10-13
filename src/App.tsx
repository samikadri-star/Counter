/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useWageCalculator } from './hooks/useWageCalculator';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { WageCalculatorScreen } from './components/WageCalculatorScreen';
import { NameManagerScreen } from './components/NameManagerScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { InstallGuideModal } from './components/InstallGuideModal';
import { PdfReportModal } from './components/PdfReportModal';
import { ExitConfirmModal } from './components/ExitConfirmModal';
import { WifiOff } from 'lucide-react';
import { SavedReportBatch } from './types';

export default function App() {
  const {
    names,
    addName,
    deleteName,
    updateName,
    resetNamesToDefault,
    records,
    addRecord,
    removeRecord,
    updateRecordName,
    updateRecordDay,
    clearAllInputs,
    getRecordTotalOps,
    getRecordDueAmount,
    ratePerOp,
    setRatePerOp,
    summary,
    savedBatches,
    archiveCurrentBatch,
    deleteBatch,
  } = useWageCalculator();

  const [activeTab, setActiveTab] = useState<'calculator' | 'names' | 'history' | 'install'>('calculator');
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedBatchForPdf, setSelectedBatchForPdf] = useState<SavedReportBatch | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Connectivity detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Exit warning on page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (summary.grandTotalOps > 0) {
        e.preventDefault();
        e.returnValue = 'لديك بيانات مسجلة في شاشة الاحتساب، هل أنت متأكد من الخروج؟';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [summary.grandTotalOps]);

  // Open PDF modal for current active week
  const handleOpenCurrentPdf = () => {
    setSelectedBatchForPdf(null);
    setShowPdfModal(true);
  };

  // Open PDF modal for an archived batch
  const handleViewBatchPdf = (batch: SavedReportBatch) => {
    setSelectedBatchForPdf(batch);
    setShowPdfModal(true);
  };

  // Confirm Exit logic
  const handleConfirmExit = () => {
    setShowExitModal(false);
    try {
      window.close();
    } catch {
      // Ignored
    }
    alert('شكراً لاستخدامك تطبيق احتساب مستحق الأرشفة الذكي. تم إغلاق الجلسة بنجاح.');
  };

  // Main content depending on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'calculator':
        return (
          <WageCalculatorScreen
            names={names}
            records={records}
            addRecord={addRecord}
            removeRecord={removeRecord}
            updateRecordName={updateRecordName}
            updateRecordDay={updateRecordDay}
            clearAllInputs={clearAllInputs}
            getRecordTotalOps={getRecordTotalOps}
            getRecordDueAmount={getRecordDueAmount}
            ratePerOp={ratePerOp}
            summary={summary}
            onOpenPdfModal={handleOpenCurrentPdf}
            onNavigateToNames={() => setActiveTab('names')}
            onArchiveBatch={() => archiveCurrentBatch()}
          />
        );
      case 'names':
        return (
          <NameManagerScreen
            names={names}
            addName={addName}
            deleteName={deleteName}
            updateName={updateName}
            resetNamesToDefault={resetNamesToDefault}
            onNavigateToCalculator={() => setActiveTab('calculator')}
          />
        );
      case 'history':
        return (
          <HistoryScreen
            batches={savedBatches}
            deleteBatch={deleteBatch}
            onViewBatchPdf={handleViewBatchPdf}
            onNavigateToCalculator={() => setActiveTab('calculator')}
          />
        );
      case 'install':
        return (
          <InstallGuideModal
            isOpen={true}
            onClose={() => setActiveTab('calculator')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111113] flex flex-col items-center justify-start antialiased selection:bg-[#E35E2D] selection:text-white">
      {/* Offline Toast Notification */}
      {!isOnline && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[#E35E2D] text-white text-xs font-bold px-4 py-1.5 border-2 border-[#111113] shadow-[3px_3px_0px_#111113]">
          <WifiOff className="w-3.5 h-3.5" />
          <span>وضع عدم الاتصال — التطبيق يعمل بكفاءة وأمان بدون إنترنت</span>
        </div>
      )}

      {/* Main Container or Mobile Frame */}
      {isMobileFrame ? (
        <div className="w-full flex justify-center py-6 px-4">
          {/* Neo-brutalist Smartphone Frame (Variation 1 Style: 390px, border-2 var(--ink), shadow 8px 8px 0 var(--ink)) */}
          <div className="w-[390px] h-[840px] bg-[#F8F7F4] border-4 border-[#111113] shadow-[8px_8px_0px_#111113] flex flex-col relative overflow-hidden">
            {/* Top Phone Cutout Bar */}
            <div className="bg-[#111113] py-1 text-center font-mono text-[9px] text-white uppercase tracking-widest flex items-center justify-between px-3">
              <span>● ANDROID OS</span>
              <span className="text-[#E35E2D] font-bold">SMART ARCHIVE V1</span>
              <span>100% 🔋</span>
            </div>

            {/* Scrollable Phone Screen */}
            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
              <Navbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onExitClick={() => setShowExitModal(true)}
                isMobileFrame={isMobileFrame}
                setIsMobileFrame={setIsMobileFrame}
                ratePerOp={ratePerOp}
                onRateChange={setRatePerOp}
              />
              <main className="flex-1 px-3 py-2">
                {renderTabContent()}
              </main>
              <BottomNav
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                namesCount={names.length}
                batchesCount={savedBatches.length}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-xl min-h-screen flex flex-col bg-[#F8F7F4] sm:border-x-2 sm:border-[#111113] sm:shadow-[6px_0px_0px_#111113]">
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onExitClick={() => setShowExitModal(true)}
            isMobileFrame={isMobileFrame}
            setIsMobileFrame={setIsMobileFrame}
            ratePerOp={ratePerOp}
            onRateChange={setRatePerOp}
          />

          <main className="flex-1 px-3 sm:px-4 py-2">
            {renderTabContent()}
          </main>

          <BottomNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            namesCount={names.length}
            batchesCount={savedBatches.length}
          />
        </div>
      )}

      {/* PDF Export & Preview Modal */}
      <PdfReportModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        records={records}
        getRecordTotalOps={getRecordTotalOps}
        getRecordDueAmount={getRecordDueAmount}
        ratePerOp={ratePerOp}
        selectedBatch={selectedBatchForPdf}
      />

      {/* Exit Confirmation Dialog */}
      <ExitConfirmModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirmExit={handleConfirmExit}
        unsavedOpsCount={summary.grandTotalOps}
      />
    </div>
  );
}
