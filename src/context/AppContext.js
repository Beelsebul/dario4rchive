import React, { useState, createContext, useContext, useCallback } from 'react';
import { MOCK_USER, MOCK_CATEGORIES, MOCK_TRANSACTIONS, MOCK_BUDGETS, MOCK_GOALS } from '../data/mockData';

// Context for managing navigation state and data
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [currentPage, setCurrentPage] = useState('dashboard'); // Initial page

    // --- Data State ---
    const [user, setUser] = useState(MOCK_USER);
    const [categories, setCategories] = useState(MOCK_CATEGORIES);
    const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
    const [budgets, setBudgets] = useState(MOCK_BUDGETS);
    const [goals, setGoals] = useState(MOCK_GOALS);

    // --- Helper for Unique IDs (for mock data) ---
    const generateId = () => `mock_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    // --- CRUD Functions ---

    // Transactions
    const addTransaction = useCallback((newTransactionData) => {
        const newTransaction = {
            ...newTransactionData,
            id: generateId(),
            user_id: user.id, // Assuming logged in user
            created_at: new Date().toISOString(),
        };
        setTransactions(prev => [newTransaction, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date))); // Add and re-sort
    }, [user?.id]);

    const updateTransaction = useCallback((updatedTransaction) => {
        setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? { ...t, ...updatedTransaction } : t));
    }, []);

    const deleteTransaction = useCallback((transactionId) => {
        setTransactions(prev => prev.filter(t => t.id !== transactionId));
    }, []);

    // Categories (Note: We prevent editing/deleting default categories - user_id === null)
    const addCategory = useCallback((newCategoryData) => {
        const newCategory = {
            ...newCategoryData,
            id: generateId(),
            user_id: user.id, // Custom category belongs to the user
        };
        setCategories(prev => [...prev, newCategory]);
    }, [user?.id]);

    const updateCategory = useCallback((updatedCategory) => {
        setCategories(prev => prev.map(c => (c.id === updatedCategory.id && c.user_id !== null) ? { ...c, ...updatedCategory } : c));
    }, []);

    const deleteCategory = useCallback((categoryId) => {
        setCategories(prev => prev.filter(c => c.id !== categoryId && c.user_id !== null));
        // Optional: Handle transactions that used this category (e.g., set to 'Uncategorized')
        // setTransactions(prev => prev.map(t => t.category_id === categoryId ? {...t, category_id: null } : t));
    }, []);

    // Budgets
    const addBudget = useCallback((newBudgetData) => {
        const newBudget = {
            ...newBudgetData,
            id: generateId(),
            user_id: user.id,
            // Ensure month is stored consistently, e.g., YYYY-MM-01
            month: newBudgetData.month ? `${newBudgetData.month}-01` : new Date().toISOString().slice(0, 7)+'-01',
        };
        setBudgets(prev => [...prev, newBudget]);
    }, [user?.id]);

    const updateBudget = useCallback((updatedBudget) => {
        setBudgets(prev => prev.map(b => b.id === updatedBudget.id ? { ...b, ...updatedBudget, month: updatedBudget.month ? `${updatedBudget.month}-01` : b.month } : b));
    }, []);

    const deleteBudget = useCallback((budgetId) => {
        setBudgets(prev => prev.filter(b => b.id !== budgetId));
    }, []);

    // --- Context Value ---
    const value = {
        currentPage,
        setCurrentPage,
        user,
        categories,
        transactions,
        budgets,
        goals,
        // Transaction Actions
        addTransaction,
        updateTransaction,
        deleteTransaction,
        // Category Actions
        addCategory,
        updateCategory,
        deleteCategory,
        // Budget Actions
        addBudget,
        updateBudget,
        deleteBudget,
        // Goal Actions (Add later if needed)
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook for easy context usage
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};