export type DayKey = 'sat' | 'sun' | 'mon' | 'tue' | 'wed' | 'thu';

export interface DayConfig {
  key: DayKey;
  labelAr: string;
}

export const WORK_DAYS: DayConfig[] = [
  { key: 'sat', labelAr: 'السبت' },
  { key: 'sun', labelAr: 'الأحد' },
  { key: 'mon', labelAr: 'الإثنين' },
  { key: 'tue', labelAr: 'الثلاثاء' },
  { key: 'wed', labelAr: 'الأربعاء' },
  { key: 'thu', labelAr: 'الخميس' },
];

export interface EmployeeName {
  id: string;
  name: string;
  createdAt: string;
}

export interface DayValues {
  sat: number;
  sun: number;
  mon: number;
  tue: number;
  wed: number;
  thu: number;
}

export interface PersonWageRecord {
  id: string;
  selectedName: string;
  days: DayValues;
  ratePerOp: number;
  notes?: string;
}

export interface SavedReportBatch {
  id: string;
  title: string;
  date: string;
  ratePerOp: number;
  records: {
    name: string;
    totalOps: number;
    totalAmount: number;
    daysBreakdown?: DayValues;
  }[];
  totalOps: number;
  totalAmount: number;
}
