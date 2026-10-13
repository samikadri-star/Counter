import React, { useState } from 'react';
import { 
  UserPlus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Search, 
  Users, 
  ArrowRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { EmployeeName } from '../types';

interface NameManagerScreenProps {
  names: EmployeeName[];
  addName: (name: string) => { success: boolean; message: string };
  deleteName: (id: string) => void;
  updateName: (id: string, newName: string) => void;
  resetNamesToDefault: () => void;
  onNavigateToCalculator: () => void;
}

export const NameManagerScreen: React.FC<NameManagerScreenProps> = ({
  names,
  addName,
  deleteName,
  updateName,
  resetNamesToDefault,
  onNavigateToCalculator,
}) => {
  const [inputName, setInputName] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNameText, setEditNameText] = useState('');

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputName.trim()) {
      setFeedback({ message: 'يرجى كتابة الاسم أولاً في المربع', isError: true });
      return;
    }

    const res = addName(inputName);
    if (res.success) {
      setFeedback({ message: res.message, isError: false });
      setInputName('');
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ message: res.message, isError: true });
    }
  };

  const startEdit = (item: EmployeeName) => {
    setEditingId(item.id);
    setEditNameText(item.name);
  };

  const saveEdit = (id: string) => {
    if (editNameText.trim()) {
      updateName(id, editNameText.trim());
    }
    setEditingId(null);
  };

  const filteredNames = names.filter((n) =>
    n.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div className="space-y-4 pb-28 pt-2">
      {/* Top Banner (Variation 1 Style) */}
      <div className="brutal-card p-4 flex items-center justify-between">
        <div>
          <div className="label-mono text-[#E35E2D]">[02] DIRECTORY // USERS</div>
          <h2 className="text-base sm:text-lg font-black text-[#111113]">
            شاشة إضافة وإدارة الأسماء
          </h2>
        </div>

        <button
          onClick={onNavigateToCalculator}
          className="brutal-btn px-3 py-1.5 text-xs font-bold flex items-center gap-1.5"
        >
          <span>شاشة الاحتساب</span>
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
        </button>
      </div>

      {/* Main Name Input Card */}
      <div className="brutal-card-tint p-4 sm:p-5">
        <div className="flex items-center gap-2 border-b-2 border-[#111113] pb-2 mb-3">
          <UserPlus className="w-4 h-4 text-[#E35E2D]" />
          <span className="label-mono font-bold text-[#111113]">NEW ENTRY // إدخال اسم جديد</span>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="label-mono block mb-1">الاسم الكامل (الموظف / الأرشيفي):</label>
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="ادخل الاسم هنا..."
              autoFocus
              className="brutal-input w-full py-3 px-3 text-sm font-bold text-[#111113]"
            />
          </div>

          {feedback && (
            <div
              className={`p-2.5 border-2 border-[#111113] text-xs font-bold flex items-center gap-2 ${
                feedback.isError ? 'bg-rose-100 text-rose-950' : 'bg-emerald-100 text-emerald-950'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{feedback.message}</span>
            </div>
          )}

          <button
            type="submit"
            className="brutal-btn w-full py-3 px-4 font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4 text-[#E35E2D] stroke-[3]" />
            <span>حفظ الاسم في القائمة</span>
          </button>
        </form>
      </div>

      {/* Saved Names Directory */}
      <div className="brutal-card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#111113] pb-3">
          <div className="flex items-center gap-2">
            <span className="label-mono">الأسماء المسجلة</span>
            <span className="font-mono text-xs font-black bg-[#111113] text-white px-2 py-0.5">
              {names.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 sm:w-48">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في الأسماء..."
                className="brutal-input w-full py-1.5 px-3 pr-8 text-xs font-bold"
              />
              <Search className="w-3.5 h-3.5 text-[#111113]/60 absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Restore default */}
            <button
              onClick={() => {
                if (confirm('هل تريد استعادة الأسماء التجريبية الافتراضية؟')) {
                  resetNamesToDefault();
                }
              }}
              className="brutal-btn-secondary p-1.5 text-xs font-bold"
              title="استعادة الأسماء الافتراضية"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#E35E2D]" />
            </button>
          </div>
        </div>

        {/* List Items */}
        {filteredNames.length === 0 ? (
          <div className="text-center py-6 text-slate-500 font-mono text-xs">
            {searchQuery ? '[NO RESULTS] لم يتم العثور على نتائج' : '[EMPTY] لا توجد أسماء مسجلة'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
            {filteredNames.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 bg-[#FFF9F2] border-2 border-[#111113] transition"
              >
                {editingId === item.id ? (
                  <div className="flex items-center gap-1.5 flex-1">
                    <input
                      type="text"
                      value={editNameText}
                      onChange={(e) => setEditNameText(e.target.value)}
                      className="brutal-input flex-1 py-1 px-2 text-xs font-bold"
                      autoFocus
                    />
                    <button
                      onClick={() => saveEdit(item.id)}
                      className="p-1 bg-[#111113] text-white"
                      title="حفظ"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 bg-white border border-[#111113]"
                      title="إلغاء"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[10px] font-bold bg-[#111113] text-white px-1.5 py-0.5">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm font-bold text-[#111113] truncate">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => startEdit(item)}
                        className="p-1 text-[#111113] hover:text-[#E35E2D]"
                        title="تعديل الاسم"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من حذف الاسم: ${item.name}؟`)) {
                            deleteName(item.id);
                          }
                        }}
                        className="p-1 text-[#111113] hover:text-rose-600"
                        title="حذف الاسم"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
