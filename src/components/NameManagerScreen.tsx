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
      {/* Top Banner Screen 1 Indicator */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-indigo-500/20 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                شاشة إضافة اسم جديد
              </h2>
              <p className="text-xs text-indigo-200">
                تسجيل وحفظ أسماء الموظفين والأرشيفيين للاستخدام في شاشة الاحتساب
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToCalculator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold border border-cyan-400/30 transition active:scale-95"
          >
            <span>شاشة الاحتساب</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>
      </div>

      {/* Main Name Entry Box (reflecting Image 02 with modern UI styling) */}
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-xl overflow-hidden">
        {/* Purple title bar from Image 02 */}
        <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 px-4 py-3 border-b border-indigo-700/40 text-center">
          <h3 className="text-sm font-bold text-indigo-100 flex items-center justify-center gap-2">
            <UserPlus className="w-4 h-4 text-cyan-400" />
            <span>إضافة اسم جديد</span>
          </h3>
        </div>

        <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              الاسم الكامل (الموظف / الأرشيفي):
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="ادخل الاسم هنا"
                autoFocus
                className="w-full text-base font-semibold text-white bg-slate-950 py-3.5 px-4 rounded-xl border-2 border-indigo-500/40 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 placeholder:text-slate-500 transition shadow-inner"
              />
            </div>
          </div>

          {/* Feedback Message */}
          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                feedback.isError
                  ? 'bg-rose-950/80 text-rose-200 border border-rose-800'
                  : 'bg-emerald-950/80 text-emerald-200 border border-emerald-800'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Save Button (Reflecting dark red / high intent CTA from Image 02) */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-700 via-red-700 to-rose-800 hover:from-rose-600 hover:to-red-600 active:scale-[0.99] text-white font-extrabold text-base tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-rose-950/60 border border-rose-500/30 transition duration-150"
          >
            <Check className="w-5 h-5 text-emerald-300 stroke-[3]" />
            <span>حفظ</span>
          </button>
        </form>
      </div>

      {/* Saved Names Directory & Management */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-200">الأسماء المحفوظة حالياً</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-bold num-tabular border border-slate-700">
              {names.length} اسم
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-48">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في الأسماء..."
                className="w-full text-xs text-slate-200 bg-slate-950 py-1.5 px-3 pr-8 rounded-lg border border-slate-800 focus:outline-none focus:border-cyan-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Reset to sample */}
            <button
              onClick={() => {
                if (confirm('هل تريد استعادة الأسماء التجريبية الافتراضية؟')) {
                  resetNamesToDefault();
                }
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
              title="استعادة الأسماء الافتراضية"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Names List */}
        {filteredNames.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            {searchQuery ? 'لم يتم العثور على اسم يطابق البحث' : 'لا توجد أسماء مسجلة بعد'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
            {filteredNames.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition"
              >
                {editingId === item.id ? (
                  <div className="flex items-center gap-1.5 flex-1">
                    <input
                      type="text"
                      value={editNameText}
                      onChange={(e) => setEditNameText(e.target.value)}
                      className="flex-1 bg-slate-900 text-white text-xs font-semibold py-1 px-2 rounded border border-cyan-500 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => saveEdit(item.id)}
                      className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                      title="حفظ التعديل"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300"
                      title="إلغاء"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 text-[10px] flex items-center justify-center font-bold num-tabular shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-semibold text-slate-200 truncate">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => startEdit(item)}
                        className="p-1 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
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
                        className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
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
