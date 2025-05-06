// Mock Data - Replace with API calls later
export const MOCK_USER = { id: 'user1', email: 'test@example.com' };

export const MOCK_CATEGORIES = [
    { id: 'cat1', user_id: null, name: 'Salary', type: 'income', color: '#16a34a' }, // Green
    { id: 'cat2', user_id: null, name: 'Freelance', type: 'income', color: '#22c55e' }, // Lime
    { id: 'cat3', user_id: 'user2', name: 'Groceries', type: 'expense', color: '#ef4444' }, // Red
    { id: 'cat4', user_id: 'user1', name: 'Rent', type: 'expense', color: '#f97316' }, // Orange
    { id: 'cat5', user_id: 'user1', name: 'Transport', type: 'expense', color: '#3b82f6' }, // Blue
    { id: 'cat6', user_id: 'user1', name: 'Entertainment', type: 'expense', color: '#a855f7' }, // Purple
];

export const MOCK_TRANSACTIONS = [
    { id: 't1', user_id: 'user1', type: 'income', amount: 3000, category_id: 'cat1', description: 'Monthly Salary', date: '2025-04-01', created_at: '2025-04-01T10:00:00Z' },
    { id: 't2', user_id: 'user1', type: 'expense', amount: 85.50, category_id: 'cat3', description: 'Weekly groceries', date: '2025-04-03', created_at: '2025-04-03T15:30:00Z' },
    { id: 't3', user_id: 'user1', type: 'expense', amount: 1200, category_id: 'cat4', description: 'April Rent', date: '2025-04-05', created_at: '2025-04-05T09:00:00Z' },
    { id: 't4', user_id: 'user1', type: 'expense', amount: 45.00, category_id: 'cat5', description: 'Bus pass', date: '2025-04-06', created_at: '2025-04-06T08:15:00Z' },
    { id: 't5', user_id: 'user1', type: 'income', amount: 500, category_id: 'cat2', description: 'Project X payment', date: '2025-04-10', created_at: '2025-04-10T11:00:00Z' },
    { id: 't6', user_id: 'user1', type: 'expense', amount: 60.00, category_id: 'cat6', description: 'Movie tickets', date: '2025-04-12', created_at: '2025-04-12T20:00:00Z' },
    { id: 't7', user_id: 'user1', type: 'expense', amount: 70.25, category_id: 'cat3', description: 'More groceries', date: '2025-04-15', created_at: '2025-04-15T17:45:00Z' },
];

export const MOCK_BUDGETS = [
    { id: 'b1', user_id: 'user1', category_id: 'cat3', month: '2025-04-01', amount_limit: 400 },
    { id: 'b2', user_id: 'user1', category_id: 'cat5', month: '2025-04-01', amount_limit: 100 },
    { id: 'b3', user_id: 'user1', category_id: 'cat6', month: '2025-04-01', amount_limit: 150 },
];

export const MOCK_GOALS = [
    { id: 'g1', user_id: 'user1', name: 'Vacation Fund', target_amount: 2000, current_amount: 350, deadline: '2025-12-31', created_at: '2025-01-15T10:00:00Z' },
    { id: 'g2', user_id: 'user1', name: 'New Laptop', target_amount: 1500, current_amount: 800, deadline: '2025-09-30', created_at: '2025-03-01T14:00:00Z' },
];