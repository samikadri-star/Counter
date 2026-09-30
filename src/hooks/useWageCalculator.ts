import { useState, useEffect, useMemo } from 'react';
import { EmployeeName, PersonWageRecord, SavedReportBatch, DayKey, DayValues } from '../types';

const STORAGE_NAMES_KEY = 'archive_app_names_v1';
const STORAGE_RECORDS_KEY = 'archive_app_records_v1';
const STORAGE_BATCHES_KEY = 'archive_app_batches_v1';
const STORAGE_RATE_KEY = 'archive_app_rate_v1';

const INITIAL_DEFAULT_NAMES: EmployeeName[] = [
  { id: '1', name: 'سامي القادري', createdAt: new Date().toISOString() },
  { id: '2', name: 'أحمد بن محمد', createdAt: new Date().toISOString() },
  { id: '3', name: 'علي حسن الشامي', createdAt: new Date().toISOString() },
  { id: '4', name: 'خالد عبدالله الزبيري', createdAt: new Date().toISOString() },
  { id: '5', name: 'فؤاد عبدالكريم', createdAt: new Date().toISOString() },
];

const emptyDayValues: DayValues = {
  sat: 0,
  sun: 0,
  mon: 0,
  tue: 0,
  wed: 0,
  thu: 0,
};

export function useWageCalculator() {
  // 1. Rate per operation (Default = 17)
  const [ratePerOp, setRatePerOp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_RATE_KEY);
      return saved ? Number(saved) || 17 : 17;
    } catch {
      return 17;
    }
  });

  // 2. Names list
  const [names, setNames] = useState<EmployeeName[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_NAMES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load names', e);
    }
    return INITIAL_DEFAULT_NAMES;
  });

  // 3. Current active records
  const [records, setRecords] = useState<PersonWageRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_RECORDS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load records', e);
    }
    // Default 3 records initially as shown in Image 01
    return [
      {
        id: 'rec_1',
        selectedName: 'سامي القادري',
        days: { sat: 12, sun: 15, mon: 10, tue: 18, wed: 14, thu: 20 },
        ratePerOp: 17,
      },
      {
        id: 'rec_2',
        selectedName: 'أحمد بن محمد',
        days: { sat: 8, sun: 12, mon: 14, tue: 9, wed: 11, thu: 15 },
        ratePerOp: 17,
      },
      {
        id: 'rec_3',
        selectedName: 'علي حسن الشامي',
        days: { sat: 20, sun: 18, mon: 22, tue: 16, wed: 24, thu: 19 },
        ratePerOp: 17,
      },
    ];
  });

  // 4. Historical archived batches ("الترحيل")
  const [savedBatches, setSavedBatches] = useState<SavedReportBatch[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BATCHES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load batches', e);
    }
    return [];
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_RATE_KEY, String(ratePerOp));
    } catch (e) {
      console.error(e);
    }
  }, [ratePerOp]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NAMES_KEY, JSON.stringify(names));
    } catch (e) {
      console.error(e);
    }
  }, [names]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_RECORDS_KEY, JSON.stringify(records));
    } catch (e) {
      console.error(e);
    }
  }, [records]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BATCHES_KEY, JSON.stringify(savedBatches));
    } catch (e) {
      console.error(e);
    }
  }, [savedBatches]);

  // Names operations
  const addName = (newName: string): { success: boolean; message: string } => {
    const trimmed = newName.trim();
    if (!trimmed) {
      return { success: false, message: 'يرجى كتابة الاسم أولاً' };
    }
    if (names.some((n) => n.name.trim().toLowerCase() === trimmed.toLowerCase())) {
      return { success: false, message: 'هذا الاسم مسجل مسبقاً' };
    }
    const created: EmployeeName = {
      id: 'name_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      name: trimmed,
      createdAt: new Date().toISOString(),
    };
    setNames((prev) => [created, ...prev]);
    return { success: true, message: 'تم حفظ الاسم بنجاح' };
  };

  const deleteName = (id: string) => {
    setNames((prev) => prev.filter((n) => n.id !== id));
  };

  const updateName = (id: string, updatedText: string) => {
    const trimmed = updatedText.trim();
    if (!trimmed) return;
    setNames((prev) =>
      prev.map((n) => (n.id === id ? { ...n, name: trimmed } : n))
    );
    // Also update any active record pointing to previous name
    const oldName = names.find((n) => n.id === id)?.name;
    if (oldName) {
      setRecords((prev) =>
        prev.map((r) =>
          r.selectedName === oldName ? { ...r, selectedName: trimmed } : r
        )
      );
    }
  };

  const resetNamesToDefault = () => {
    setNames(INITIAL_DEFAULT_NAMES);
  };

  // Record operations
  const addRecord = (preferredName?: string) => {
    // Pick first name not yet used, or first name available
    const usedNames = new Set(records.map((r) => r.selectedName));
    const nextUnused = names.find((n) => !usedNames.has(n.name));
    const chosenName = preferredName || (nextUnused ? nextUnused.name : names[0]?.name || '');

    const newRec: PersonWageRecord = {
      id: 'rec_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      selectedName: chosenName,
      days: { ...emptyDayValues },
      ratePerOp: ratePerOp,
    };
    setRecords((prev) => [...prev, newRec]);
  };

  const removeRecord = (id: string) => {
    setRecords((prev) => {
      if (prev.length <= 1) {
        // Keep at least one empty record
        return [
          {
            id: 'rec_' + Date.now(),
            selectedName: names[0]?.name || '',
            days: { ...emptyDayValues },
            ratePerOp,
          },
        ];
      }
      return prev.filter((r) => r.id !== id);
    });
  };

  const updateRecordName = (id: string, newSelectedName: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, selectedName: newSelectedName } : r))
    );
  };

  const updateRecordDay = (id: string, day: DayKey, value: number) => {
    const sanitizedVal = Math.max(0, isNaN(value) ? 0 : Math.floor(value));
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              days: {
                ...r.days,
                [day]: sanitizedVal,
              },
            }
          : r
      )
    );
  };

  const clearAllInputs = () => {
    setRecords((prev) =>
      prev.map((r) => ({
        ...r,
        days: { ...emptyDayValues },
      }))
    );
  };

  // Calculations for individual record
  const getRecordTotalOps = (rec: PersonWageRecord): number => {
    const d = rec.days;
    return (
      (d.sat || 0) +
      (d.sun || 0) +
      (d.mon || 0) +
      (d.tue || 0) +
      (d.wed || 0) +
      (d.thu || 0)
    );
  };

  const getRecordDueAmount = (rec: PersonWageRecord): number => {
    const totalOps = getRecordTotalOps(rec);
    const rate = rec.ratePerOp || ratePerOp;
    return totalOps * rate;
  };

  // Overall statistics
  const summary = useMemo(() => {
    let grandOps = 0;
    let grandAmount = 0;
    let filledCount = 0;

    records.forEach((r) => {
      const ops = getRecordTotalOps(r);
      const amount = ops * (r.ratePerOp || ratePerOp);
      grandOps += ops;
      grandAmount += amount;
      if (ops > 0 && r.selectedName) {
        filledCount++;
      }
    });

    return {
      grandTotalOps: grandOps,
      grandTotalAmount: grandAmount,
      totalRecords: records.length,
      activePersonsCount: filledCount,
    };
  }, [records, ratePerOp]);

  // Archive / Posting batch ("ترحيل")
  const archiveCurrentBatch = (customTitle?: string): SavedReportBatch | null => {
    // Only archive if there is at least some data
    const validRecords = records.filter(
      (r) => r.selectedName && getRecordTotalOps(r) >= 0
    );
    if (validRecords.length === 0) return null;

    const todayStr = new Date().toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const newBatch: SavedReportBatch = {
      id: 'batch_' + Date.now(),
      title: customTitle || `ترحيل مستحقات أسبوع - ${todayStr}`,
      date: new Date().toISOString(),
      ratePerOp,
      records: validRecords.map((r) => {
        const ops = getRecordTotalOps(r);
        return {
          name: r.selectedName,
          totalOps: ops,
          totalAmount: ops * (r.ratePerOp || ratePerOp),
          daysBreakdown: { ...r.days },
        };
      }),
      totalOps: summary.grandTotalOps,
      totalAmount: summary.grandTotalAmount,
    };

    setSavedBatches((prev) => [newBatch, ...prev]);
    return newBatch;
  };

  const deleteBatch = (id: string) => {
    setSavedBatches((prev) => prev.filter((b) => b.id !== id));
  };

  return {
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
  };
}
