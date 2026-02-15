import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { expenseCategories } from '../../constants';

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
  });

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

  const handleSave = () => {
    if (!form.description.trim()) return;
    onSave({
      ...form,
      amount: parseFloat(form.amount) || 0,
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
            disabled={!form.description.trim()}
            className="px-6 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditing ? 'Update' : 'Record Expense'}
          </button>
        </div>
      </div>
    </div>
  );
}
