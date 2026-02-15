import { useState, useCallback, useRef } from 'react';

/**
 * useExpenses Hook
 * Manages expense data and operations
 * Each expense: { id, propertyId, propertyName, category, description, amount, date, vendor, notes, createdAt, createdBy }
 */
export const useExpenses = (currentUser, saveExpenses, showToast) => {
  const saveRef = useRef(saveExpenses);
  saveRef.current = saveExpenses;

  const [expenses, setExpenses] = useState([]);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(null); // null | 'create' | expense object (edit)

  const addExpense = useCallback((expense) => {
    const newExpense = {
      ...expense,
      id: expense.id || Date.now().toString(),
      createdAt: expense.createdAt || new Date().toISOString(),
    };
    const updated = [...expenses, newExpense];
    setExpenses(updated);
    saveRef.current(updated);
    showToast('Expense recorded', 'success');
  }, [expenses, showToast]);

  const updateExpense = useCallback((expenseId, updates) => {
    const updated = expenses.map(e =>
      e.id === expenseId ? { ...e, ...updates } : e
    );
    setExpenses(updated);
    saveRef.current(updated);
    showToast('Expense updated', 'success');
  }, [expenses, showToast]);

  const deleteExpense = useCallback((expenseId) => {
    const updated = expenses.filter(e => e.id !== expenseId);
    setExpenses(updated);
    saveRef.current(updated);
    showToast('Expense deleted', 'info');
  }, [expenses, showToast]);

  return {
    expenses,
    showAddExpenseModal,
    addExpense,
    updateExpense,
    deleteExpense,
    setShowAddExpenseModal,
    setExpenses,
  };
};

export default useExpenses;
