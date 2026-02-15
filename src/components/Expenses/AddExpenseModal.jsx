import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { expenseCategories, MILEAGE_RATE } from '../../constants';

export default function AddExpenseModal({ expense, properties, onSave, onDelete, onClose }) {
  const isEditing = expense && expense.id;

  const [form, setForm] = useState({
    propertyId: '',
    propertyName: '',
    category: 'repair',
    description: '',
    amount: '',
    date: '',
    vendor: '',
    notes: '',
    // Mileage-specific fields
    miles: '',
    tripFrom: '',
    tripTo: '',
  });

  const isMileage = form.category === 'mileage';

  useEffect(() => {
    if (isEditing) {
      setForm({
        propertyId: expense.propertyId || '',
        propertyName: expense.propertyName || '',
        category: expense.category || 'repair',
        description: expense.description || '',
        amount: expense.amount || '',
        date: expense.date || '',
        vendor: expense.vendor || '',
        notes: expense.notes || '',
        miles: expense.miles || '',
        tripFrom: expense.tripFrom || '',
        tripTo: expense.tripTo || '',
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setForm(f => ({ ...f, date: today }));
    }
  }, [expense, isEditing]);

  const handlePropertyChange = (propertyId) => {
    const prop = properties.find(p => String(p.id) === String(propertyId));
    setForm(f => ({
      ...f,
      propertyId,
      propertyName: prop ? `${prop.emoji || '🏠'} ${prop.name}` : '',
    }));
  };

  // Auto-calculate mileage amount and description
  const handleMilesChange = (miles) => {
    const milesNum = parseFloat(miles) || 0;
    const amount = (milesNum * MILEAGE_RATE).toFixed(2);
    setForm(f => ({ ...f, miles, amount }));
  };

  // Auto-build description from trip fields
  const buildTripDescription = (from, to) => {
    if (from && to) return `Trip: ${from} → ${to}`;
    if (from) return `Trip from ${from}`;
    if (to) return `Trip to ${to}`;
    return '';
  };

  const handleTripFieldChange = (field, value) => {
    setForm(f => {
      const updated = { ...f, [field]: value };
      const from = field === 'tripFrom' ? value : f.tripFrom;
      const to = field === 'tripTo' ? value : f.tripTo;
      // Only auto-set description if it's empty or was auto-generated
      const currentDesc = f.description;
      const prevAutoDesc = buildTripDescription(f.tripFrom, f.tripTo);
      if (!currentDesc || currentDesc === prevAutoDesc) {
        updated.description = buildTripDescription(from, to);
      }
      return updated;
    });
  };

  const handleSave = () => {
    if (isMileage) {
      if (!form.miles || parseFloat(form.miles) <= 0) return;
    } else {
      if (!form.description.trim()) return;
    }
    onSave({
      ...form,
      amount: parseFloat(form.amount) || 0,
      miles: isMileage ? parseFloat(form.miles) || 0 : undefined,
      tripFrom: isMileage ? form.tripFrom : undefined,
      tripTo: isMileage ? form.tripTo : undefined,
      description: form.description || (isMileage ? `Mileage: ${form.miles} mi` : ''),
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-800 border border-white/10 rounded-t-3xl md:rounded-3xl p-6 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">{isEditing ? 'Edit Expense' : 'Record Expense'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Category */}
          <div>
            <label className="text-xs text-white/40 mb-1 block">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {expenseCategories.map(c => (
                <button
                  key={c.value}
                  onClick={() => setForm(f => ({ ...f, category: c.value }))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition border ${
                    form.category === c.value
                      ? 'bg-red-500/20 border-red-500/30 text-red-300'
                      : 'bg-white/[0.05] border-white/[0.08] text-white/40 hover:bg-white/10'
                  }`}
                >{c.emoji} {c.label}</button>
              ))}
            </div>
          </div>

          {/* Mileage-specific fields */}
          {isMileage ? (
            <>
              {/* Trip From / To */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🚗</span>
                  <span className="text-sm font-medium text-white/70">Trip Details</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">From</label>
                    <input
                      type="text"
                      value={form.tripFrom}
                      onChange={e => handleTripFieldChange('tripFrom', e.target.value)}
                      placeholder="e.g., Home"
                      className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">To</label>
                    <input
                      type="text"
                      value={form.tripTo}
                      onChange={e => handleTripFieldChange('tripTo', e.target.value)}
                      placeholder="e.g., 123 Main St"
                      className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>

                {/* Miles & auto-calculated amount */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">Miles (round trip)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.miles}
                      onChange={e => handleMilesChange(e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">Deduction @ ${MILEAGE_RATE}/mi</label>
                    <div className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm font-medium text-emerald-400">
                      ${form.amount || '0.00'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Property */}
              <div>
                <label className="text-xs text-white/40 mb-1 block">Property</label>
                <select
                  value={form.propertyId}
                  onChange={e => handlePropertyChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="">General (no property)</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.emoji || '🏠'} {p.name}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="text-xs text-white/40 mb-1 block">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs text-white/40 mb-1 block">Notes</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Purpose of trip..."
                  className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </>
          ) : (
            <>
              {/* Standard expense fields */}
              {/* Description */}
              <div>
                <label className="text-xs text-white/40 mb-1 block">Description *</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="e.g., Replaced water heater"
                  className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              {/* Property */}
              <div>
                <label className="text-xs text-white/40 mb-1 block">Property</label>
                <select
                  value={form.propertyId}
                  onChange={e => handlePropertyChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="">General (no property)</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.emoji || '🏠'} {p.name}</option>
                  ))}
                </select>
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    placeholder="0.00"
                    className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              {/* Vendor */}
              <div>
                <label className="text-xs text-white/40 mb-1 block">Vendor / Payee</label>
                <input
                  type="text"
                  value={form.vendor}
                  onChange={e => setForm(f => ({ ...f, vendor: e.target.value }))}
                  placeholder="e.g., Home Depot, Plumber Co."
                  className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs text-white/40 mb-1 block">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Optional notes..."
                  rows={2}
                  className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 resize-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6">
          {isEditing && onDelete ? (
            <button
              onClick={() => onDelete(expense.id)}
              className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/20 transition"
            >
              <Trash2 className="w-4 h-4 inline mr-1" /> Delete
            </button>
          ) : <div />}
          <button
            onClick={handleSave}
            disabled={isMileage ? (!form.miles || parseFloat(form.miles) <= 0) : !form.description.trim()}
            className="px-6 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditing ? 'Update' : isMileage ? 'Log Trip' : 'Record Expense'}
          </button>
        </div>
      </div>
    </div>
  );
}
