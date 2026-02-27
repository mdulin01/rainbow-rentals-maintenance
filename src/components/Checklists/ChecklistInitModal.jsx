import React, { useState } from 'react';
import { X, ChevronRight, Home } from 'lucide-react';
import { MOVE_IN_TEMPLATE_ITEMS, MOVE_OUT_TEMPLATE_ITEMS } from '../../constants';

const ChecklistInitModal = ({ onClose, onCreateChecklist, properties, currentUser }) => {
  const [step, setStep] = useState(1); // 1 = pick type, 2 = pick property
  const [checklistType, setChecklistType] = useState(null); // 'move-in' | 'move-out'
  const [selectedPropertyId, setSelectedPropertyId] = useState('');

  const templateItems = checklistType === 'move-in' ? MOVE_IN_TEMPLATE_ITEMS : MOVE_OUT_TEMPLATE_ITEMS;

  const handleCreate = () => {
    if (!checklistType || !selectedPropertyId) return;

    const property = properties.find(p => String(p.id) === String(selectedPropertyId));
    if (!property) return;

    const newChecklist = {
      id: Date.now(),
      name: `${checklistType === 'move-in' ? 'Move-In' : 'Move-Out'} — ${property.name}`,
      emoji: checklistType === 'move-in' ? '📋' : '📦',
      category: checklistType,
      linkedTo: { section: 'property', itemId: String(property.id) },
      items: templateItems.map((t, idx) => ({
        id: Date.now() + idx + 1,
        text: t.text,
        checked: false,
        addedBy: currentUser,
        checkedBy: null,
        checkedAt: null,
        addedAt: new Date().toISOString(),
        photos: [],
      })),
      assignedTo: 'Both',
      signature: null,
      highlighted: false,
      createdBy: currentUser,
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    onCreateChecklist(newChecklist);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-[200]">
      <div className="bg-slate-800 rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-md border border-white/10 overflow-hidden max-h-[85vh] flex flex-col"
        style={{ animation: 'checklistInitIn 0.25s cubic-bezier(0.16,1,0.3,1) both' }}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-white">
              {step === 1 ? 'New Checklist' : 'Select Property'}
            </h3>
            <p className="text-xs text-white/40 mt-0.5">
              {step === 1 ? 'Choose move-in or move-out' : 'Which property is this for?'}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-3">
              {/* Move-In option */}
              <button onClick={() => { setChecklistType('move-in'); setStep(2); }}
                className="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-teal-500/30 transition text-left group">
                <span className="text-3xl">📋</span>
                <div className="flex-1">
                  <div className="text-base font-semibold text-white">Move-In Checklist</div>
                  <div className="text-xs text-white/40 mt-0.5">{MOVE_IN_TEMPLATE_ITEMS.length} items — keys, lease, insurance, walkthrough...</div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-teal-400 transition" />
              </button>

              {/* Move-Out option */}
              <button onClick={() => { setChecklistType('move-out'); setStep(2); }}
                className="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-teal-500/30 transition text-left group">
                <span className="text-3xl">📦</span>
                <div className="flex-1">
                  <div className="text-base font-semibold text-white">Move-Out Checklist</div>
                  <div className="text-xs text-white/40 mt-0.5">{MOVE_OUT_TEMPLATE_ITEMS.length} items — keys returned, walkthrough, deposit...</div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-teal-400 transition" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {/* Back to type selection */}
              <button onClick={() => setStep(1)}
                className="text-xs text-teal-400 hover:text-teal-300 font-medium">
                ← Back to type selection
              </button>

              {/* Type badge */}
              <div className="flex items-center gap-2 px-3 py-2 bg-teal-500/10 border border-teal-500/20 rounded-xl">
                <span className="text-lg">{checklistType === 'move-in' ? '📋' : '📦'}</span>
                <span className="text-sm font-medium text-teal-400">
                  {checklistType === 'move-in' ? 'Move-In' : 'Move-Out'} Checklist
                </span>
                <span className="text-xs text-white/30 ml-auto">{templateItems.length} items</span>
              </div>

              {/* Property selection */}
              <div>
                <label className="text-xs text-white/50 font-medium mb-1.5 block">Property</label>
                <select
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-sm text-white focus:border-teal-400 focus:outline-none appearance-none"
                >
                  <option value="">Select a property...</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.emoji || '🏠'} {p.name}</option>
                  ))}
                </select>
              </div>

              {/* Template preview */}
              <div>
                <div className="text-xs text-white/40 font-medium mb-2">Checklist items (pre-filled):</div>
                <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
                  {templateItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-white/[0.03]">
                      <span className="text-sm">{item.icon}</span>
                      <span className="text-xs text-white/60">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Create button */}
              <button onClick={handleCreate}
                disabled={!selectedPropertyId}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold text-sm hover:from-teal-600 hover:to-cyan-600 transition disabled:opacity-30 disabled:cursor-not-allowed mt-2">
                Create Checklist
              </button>
            </div>
          )}
        </div>

        <style>{`
          @keyframes checklistInitIn { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        `}</style>
      </div>
    </div>
  );
};

export default ChecklistInitModal;
