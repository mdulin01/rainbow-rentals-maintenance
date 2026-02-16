import React, { useState, useMemo } from 'react';
import { Search, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { expenseCategories } from '../../constants';
import { formatDate, formatCurrency } from '../../utils';

export default function ExpensesList({ expenses, properties, onAdd, onEdit, onDelete, showToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [sortCol, setSortCol] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  // Filter
  const filtered = useMemo(() => {
    let result = [...expenses];
    if (categoryFilter !== 'all') result = result.filter(e => e.category === categoryFilter);
    if (propertyFilter !== 'all') result = result.filter(e => e.propertyId === propertyFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e =>
        (e.description || '').toLowerCase().includes(q) ||
        (e.propertyName || '').toLowerCase().includes(q) ||
        (e.vendor || '').toLowerCase().includes(q) ||
        (e.notes || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [expenses, categoryFilter, propertyFilter, searchQuery]);

  // Sort
  const sorted = useMemo(() => {
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      switch (sortCol) {
        case 'description': return dir * (a.description || '').localeCompare(b.description || '');
        case 'property': return dir * (a.propertyName || '').localeCompare(b.propertyName || '');
        case 'category': return dir * (a.category || '').localeCompare(b.category || '');
        case 'date': return dir * (a.date || 'zzzz').localeCompare(b.date || 'zzzz');
        case 'amount': return dir * ((a.amount || 0) - (b.amount || 0));
        default: return 0;
      }
    });
  }, [filtered, sortCol, sortDir]);

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir(col === 'amount' ? 'desc' : 'asc');
    }
  };

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <ChevronDown className="w-3 h-3 opacity-30 inline ml-1" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-red-400 inline ml-1" />
      : <ChevronDown className="w-3 h-3 text-red-400 inline ml-1" />;
  };

  const getCategoryBadge = (category) => {
    const c = expenseCategories.find(ec => ec.value === category);
    if (!c) return <span className="text-xs text-white/40">{category}</span>;
    return (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300">
        {c.emoji} {c.label}
      </span>
    );
  };

  // Summary stats
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const currentYear = new Date().getFullYear().toString();
  const ytdExpenses = expenses
    .filter(e => (e.date || '').startsWith(currentYear))
    .reduce((sum, e) => sum + (e.amount || 0), 0);
  const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const monthExpenses = expenses
    .filter(e => (e.date || '').startsWith(currentMonth))
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Expenses</h2>
          <p className="text-xs text-white/40">{expenses.length} expense records</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition"
        >
          <Plus className="w-4 h-4" /> Record Expense
        </button>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-3">
          <p className="text-white/40 text-xs mb-1">This Month</p>
          <p className="text-xl font-bold text-red-400">{formatCurrency(monthExpenses)}</p>
        </div>
        <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-3">
          <p className="text-white/40 text-xs mb-1">YTD</p>
          <p className="text-xl font-bold text-red-400">{formatCurrency(ytdExpenses)}</p>
        </div>
        <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-3">
          <p className="text-white/40 text-xs mb-1">All Time</p>
          <p className="text-xl font-bold text-white">{formatCurrency(totalExpenses)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-500/50"
          />
        </div>
        <select
          value={propertyFilter}
          onChange={e => setPropertyFilter(e.target.value)}
          className="px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50"
        >
          <option value="all">All Properties</option>
          {properties.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50"
        >
          <option value="all">All Categories</option>
          {expenseCategories.map(c => (
            <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {sorted.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-2">💸</p>
          <p className="text-white/30">No expenses recorded</p>
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wide cursor-pointer hover:text-white/60" onClick={() => handleSort('date')}>
                    Date <SortIcon col="date" />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wide cursor-pointer hover:text-white/60" onClick={() => handleSort('description')}>
                    Description <SortIcon col="description" />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wide cursor-pointer hover:text-white/60" onClick={() => handleSort('category')}>
                    Category <SortIcon col="category" />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wide cursor-pointer hover:text-white/60" onClick={() => handleSort('property')}>
                    Property <SortIcon col="property" />
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wide cursor-pointer hover:text-white/60" onClick={() => handleSort('amount')}>
                    Amount <SortIcon col="amount" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(exp => (
                  <tr
                    key={exp.id}
                    className="border-b border-white/[0.05] hover:bg-white/[0.03] transition cursor-pointer"
                    onClick={() => onEdit(exp)}
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm text-white/70">{exp.date ? formatDate(exp.date) : '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-white">
                        {exp.description || '—'}
                        {exp.recurring && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 align-middle">🔄 {exp.recurringFrequency || 'recurring'}</span>}
                        {exp.receiptPhoto && <span className="ml-1.5 text-[10px] text-white/30 align-middle">📸</span>}
                      </span>
                      {exp.category === 'mileage' && exp.miles && (
                        <span className="text-xs text-white/40 block">🚗 {exp.miles} mi</span>
                      )}
                      {exp.vendor && <span className="text-xs text-white/40 block">{exp.vendor}</span>}
                    </td>
                    <td className="px-4 py-3">{getCategoryBadge(exp.category)}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-white/70">{exp.propertyName || '—'}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium text-red-400">{formatCurrency(exp.amount || 0)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
