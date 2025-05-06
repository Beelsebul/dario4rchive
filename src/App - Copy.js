import React, { useState, createContext, useContext, useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Home, DollarSign, List, Tag, Target, Settings, LogOut, PlusCircle, Edit, Trash2, ChevronDown, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import './index.css';
import './App.css';



// Mock Data - Replace with API calls later
const MOCK_USER = { id: 'user1', email: 'test@example.com' };

const MOCK_CATEGORIES = [
    { id: 'cat1', user_id: null, name: 'Salary', type: 'income', color: '#16a34a' }, // Green
    { id: 'cat2', user_id: null, name: 'Freelance', type: 'income', color: '#22c55e' }, // Lime
    { id: 'cat3', user_id: 'user1', name: 'Groceries', type: 'expense', color: '#ef4444' }, // Red
    { id: 'cat4', user_id: 'user1', name: 'Rent', type: 'expense', color: '#f97316' }, // Orange
    { id: 'cat5', user_id: 'user1', name: 'Transport', type: 'expense', color: '#3b82f6' }, // Blue
    { id: 'cat6', user_id: 'user1', name: 'Entertainment', type: 'expense', color: '#a855f7' }, // Purple
];

const MOCK_TRANSACTIONS = [
    { id: 't1', user_id: 'user1', type: 'income', amount: 3000, category_id: 'cat1', description: 'Monthly Salary', date: '2025-04-01', created_at: '2025-04-01T10:00:00Z' },
    { id: 't2', user_id: 'user1', type: 'expense', amount: 85.50, category_id: 'cat3', description: 'Weekly groceries', date: '2025-04-03', created_at: '2025-04-03T15:30:00Z' },
    { id: 't3', user_id: 'user1', type: 'expense', amount: 1200, category_id: 'cat4', description: 'April Rent', date: '2025-04-05', created_at: '2025-04-05T09:00:00Z' },
    { id: 't4', user_id: 'user1', type: 'expense', amount: 45.00, category_id: 'cat5', description: 'Bus pass', date: '2025-04-06', created_at: '2025-04-06T08:15:00Z' },
    { id: 't5', user_id: 'user1', type: 'income', amount: 500, category_id: 'cat2', description: 'Project X payment', date: '2025-04-10', created_at: '2025-04-10T11:00:00Z' },
    { id: 't6', user_id: 'user1', type: 'expense', amount: 60.00, category_id: 'cat6', description: 'Movie tickets', date: '2025-04-12', created_at: '2025-04-12T20:00:00Z' },
    { id: 't7', user_id: 'user1', type: 'expense', amount: 70.25, category_id: 'cat3', description: 'More groceries', date: '2025-04-15', created_at: '2025-04-15T17:45:00Z' },
];

const MOCK_BUDGETS = [
    { id: 'b1', user_id: 'user1', category_id: 'cat3', month: '2025-04-01', amount_limit: 400 },
    { id: 'b2', user_id: 'user1', category_id: 'cat5', month: '2025-04-01', amount_limit: 100 },
    { id: 'b3', user_id: 'user1', category_id: 'cat6', month: '2025-04-01', amount_limit: 150 },
];

const MOCK_GOALS = [
    { id: 'g1', user_id: 'user1', name: 'Vacation Fund', target_amount: 2000, current_amount: 350, deadline: '2025-12-31', created_at: '2025-01-15T10:00:00Z' },
    { id: 'g2', user_id: 'user1', name: 'New Laptop', target_amount: 1500, current_amount: 800, deadline: '2025-09-30', created_at: '2025-03-01T14:00:00Z' },
];

// --- UI Components (using Tailwind CSS classes) ---

// Shadcn/ui inspired components (simplified for brevity)
// In a real app, you'd install and import these from 'shadcn/ui'
const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }) => {
    const baseStyle = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700/90",
        destructive: "bg-red-600 text-white hover:bg-red-700/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
    };
    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
    };
    return <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
};

const Input = ({ className = '', type = 'text', ...props }) => (
    <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
    />
);

const Label = ({ children, className = '', ...props }) => (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
        {children}
    </label>
);

const Select = ({ children, className = '', ...props }) => (
    <select
        className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ${className}`}
        {...props}
    >
        {children}
    </select>
);

const Card = ({ children, className = '', ...props }) => (
    <div className={`rounded-lg border bg-white text-gray-900 shadow-sm ${className}`} {...props}>
        {children}
    </div>
);

const CardHeader = ({ children, className = '', ...props }) => (
    <div className={`flex flex-col space-y-1.5 p-4 ${className}`} {...props}>
        {children}
    </div>
);

const CardTitle = ({ children, className = '', as = 'h3', ...props }) => {
    const Tag = as;
    return <Tag className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>{children}</Tag>;
};

const CardDescription = ({ children, className = '', ...props }) => (
    <p className={`text-sm text-gray-600 ${className}`} {...props}>{children}</p>
);

const CardContent = ({ children, className = '', ...props }) => (
    <div className={`p-4 pt-0 ${className}`} {...props}>
        {children}
    </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
    <div className={`flex items-center p-4 pt-0 ${className}`} {...props}>
        {children}
    </div>
);

const Table = ({ children, className = '', ...props }) => (
    <div className="relative w-full overflow-auto">
        <table className={`w-full caption-bottom text-sm ${className}`} {...props}>
            {children}
        </table>
    </div>
);

const TableHeader = ({ children, className = '', ...props }) => (
    <thead className={`[&_tr]:border-b ${className}`} {...props}>
        {children}
    </thead>
);

const TableBody = ({ children, className = '', ...props }) => (
    <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props}>
        {children}
    </tbody>
);

const TableRow = ({ children, className = '', ...props }) => (
    <tr className={`border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 ${className}`} {...props}>
        {children}
    </tr>
);

const TableHead = ({ children, className = '', ...props }) => (
    <th className={`h-12 px-4 text-left align-middle font-medium text-gray-600 [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>
        {children}
    </th>
);

const TableCell = ({ children, className = '', ...props }) => (
    <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>
        {children}
    </td>
);

// --- App Structure ---

// Context for managing navigation state
const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [currentPage, setCurrentPage] = useState('dashboard'); // Initial page

    const value = {
        currentPage,
        setCurrentPage,
        user: MOCK_USER,
        categories: MOCK_CATEGORIES,
        transactions: MOCK_TRANSACTIONS,
        budgets: MOCK_BUDGETS,
        goals: MOCK_GOALS,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Sidebar Navigation Component
const Sidebar = () => {
    const { currentPage, setCurrentPage } = useContext(AppContext);
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'transactions', label: 'Transactions', icon: List },
        { id: 'categories', label: 'Categories', icon: Tag },
        { id: 'budgets', label: 'Budgets', icon: DollarSign }, // Changed icon
        { id: 'goals', label: 'Goals', icon: Target },
    ];

    return (
        <aside className="w-64 bg-gray-800 text-white flex flex-col min-h-screen">
            <div className="p-4 text-2xl font-bold border-b border-gray-700">FinTrack</div>
            <nav className="flex-1 p-2 space-y-1">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setCurrentPage(item.id)}
                        className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === item.id ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                    >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.label}
                    </button>
                ))}
            </nav>
            <div className="p-2 border-t border-gray-700">
                <button
                    onClick={() => alert('Settings clicked!')} // Placeholder action
                    className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                    <Settings className="mr-3 h-5 w-5" />
                    Settings
                </button>
                <button
                    onClick={() => alert('Logout clicked!')} // Placeholder action
                    className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

// --- Page Components ---

// Dashboard Page
const Dashboard = () => {
    const { transactions, categories, budgets, goals } = useContext(AppContext);

    // --- Data Processing for Charts ---
    const expenseData = useMemo(() => {
        const expenseByCategory = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                const category = categories.find(c => c.id === t.category_id);
                const name = category ? category.name : 'Uncategorized';
                const color = category ? category.color : '#8884d8'; // Default color
                acc[name] = (acc[name] || { name, value: 0, fill: color });
                acc[name].value += t.amount;
                return acc;
            }, {});
        return Object.values(expenseByCategory);
    }, [transactions, categories]);

    const incomeExpenseTrend = useMemo(() => {
        // Simple example: total income vs total expense this month (assuming April 2025)
        const currentMonth = '2025-04';
        const monthlyData = transactions
            .filter(t => t.date.startsWith(currentMonth))
            .reduce((acc, t) => {
                if (t.type === 'income') acc.income += t.amount;
                if (t.type === 'expense') acc.expense += t.amount;
                return acc;
            }, { name: 'April 2025', income: 0, expense: 0 });
        return [monthlyData]; // Bar chart expects an array
    }, [transactions]);

    const totalIncome = incomeExpenseTrend[0]?.income || 0;
    const totalExpense = incomeExpenseTrend[0]?.expense || 0;
    const netSavings = totalIncome - totalExpense;

    // Budget Progress Calculation
    const budgetProgress = useMemo(() => {
        return budgets.map(budget => {
            const category = categories.find(c => c.id === budget.category_id);
            const spent = transactions
                .filter(t => t.category_id === budget.category_id && t.type === 'expense' && t.date.startsWith('2025-04')) // Assuming April
                .reduce((sum, t) => sum + t.amount, 0);
            const progress = Math.min((spent / budget.amount_limit) * 100, 100); // Cap at 100%
            return {
                ...budget,
                categoryName: category ? category.name : 'Unknown',
                spent,
                progress,
            };
        });
    }, [budgets, transactions, categories]);

    // Goal Progress Calculation
    const goalProgress = useMemo(() => {
        return goals.map(goal => {
            const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
            return {
                ...goal,
                progress,
            };
        });
    }, [goals]);


    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-600">Total Income (Apr)</CardTitle>
                        <CardDescription className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-600">Total Expenses (Apr)</CardTitle>
                        <CardDescription className="text-2xl font-bold text-red-600">${totalExpense.toFixed(2)}</CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-600">Net Savings (Apr)</CardTitle>
                        <CardDescription className={`text-2xl font-bold ${netSavings >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                            ${netSavings.toFixed(2)}
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Expenses by Category (April)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72"> {/* Fixed height for chart */}
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {expenseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Income vs Expense Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72"> {/* Fixed height for chart */}
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={incomeExpenseTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                                <Legend />
                                <Bar dataKey="income" fill="#16a34a" name="Income" />
                                <Bar dataKey="expense" fill="#ef4444" name="Expense" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

             {/* Budget & Goal Progress */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Budget Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle>Budget Progress (April)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {budgetProgress.length > 0 ? budgetProgress.map(budget => (
                            <div key={budget.id}>
                                <div className="flex justify-between mb-1 text-sm font-medium">
                                    <span>{budget.categoryName}</span>
                                    <span>${budget.spent.toFixed(2)} / ${budget.amount_limit.toFixed(2)}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{ width: `${budget.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )) : <p className="text-gray-500">No budgets set for this month.</p>}
                    </CardContent>
                </Card>

                {/* Goal Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle>Savings Goals</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {goalProgress.length > 0 ? goalProgress.map(goal => (
                           <div key={goal.id}>
                                <div className="flex justify-between mb-1 text-sm font-medium">
                                    <span>{goal.name} (Target: ${goal.target_amount.toFixed(2)})</span>
                                    <span>${goal.current_amount.toFixed(2)} ({goal.progress.toFixed(1)}%)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-green-600 h-2.5 rounded-full"
                                        style={{ width: `${goal.progress}%` }}
                                    ></div>
                                </div>
                                {goal.deadline && <p className="text-xs text-gray-500 mt-1">Deadline: {format(new Date(goal.deadline), 'PPP')}</p>}
                            </div>
                        )) : <p className="text-gray-500">No savings goals set.</p>}
                    </CardContent>
                </Card>
            </div>

        </div>
    );
};

// Transactions Page
const Transactions = () => {
    const { transactions, categories } = useContext(AppContext);
    const [showAddModal, setShowAddModal] = useState(false);
    // Add state for editing if needed

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Uncategorized';
    };

    const handleAddTransaction = (e) => {
        e.preventDefault();
        // Logic to add transaction (will need state and API call)
        console.log("Add transaction form submitted");
        setShowAddModal(false); // Close modal after submission
        alert("Transaction added (mock)!");
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Transactions</h1>
                <Button onClick={() => setShowAddModal(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
                </Button>
            </div>

            {/* Filters (Add functionality later) */}
            <div className="flex space-x-4">
                <Input type="date" placeholder="Start Date" />
                <Input type="date" placeholder="End Date" />
                <Select>
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
                <Select>
                    <option value="">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </Select>
                <Button variant="outline">Apply Filters</Button>
            </div>

            {/* Transaction Table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.length > 0 ? transactions.map(t => (
                            <TableRow key={t.id}>
                                <TableCell>{format(new Date(t.date), 'PPP')}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                                    </span>
                                </TableCell>
                                <TableCell>{getCategoryName(t.category_id)}</TableCell>
                                <TableCell>{t.description || '-'}</TableCell>
                                <TableCell className={`text-right font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    ${t.amount.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-1">
                                        <Button variant="ghost" size="icon" onClick={() => alert(`Edit ${t.id}`)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => alert(`Delete ${t.id}`)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-gray-500">No transactions found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Add Transaction Modal (Basic Structure) */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <Card className="w-full max-w-md">
                        <form onSubmit={handleAddTransaction}>
                            <CardHeader>
                                <CardTitle>Add New Transaction</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                     <div>
                                        <Label htmlFor="type">Type</Label>
                                        <Select id="type" required>
                                            <option value="expense">Expense</option>
                                            <option value="income">Income</option>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="amount">Amount</Label>
                                        <Input id="amount" type="number" step="0.01" placeholder="0.00" required />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <Select id="category" required>
                                        <option value="">Select a category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="date">Date</Label>
                                    <Input id="date" type="date" required defaultValue={format(new Date(), 'yyyy-MM-dd')} />
                                </div>
                                <div>
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Input id="description" placeholder="e.g., Coffee with friend" />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end space-x-2">
                                <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
                                <Button type="submit">Add Transaction</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

// Categories Page
const Categories = () => {
    const { categories } = useContext(AppContext);
    // Add state for adding/editing categories

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Categories</h1>
                <Button onClick={() => alert('Add Category clicked!')}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </div>
             <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Color</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.filter(c => c.user_id !== null).length > 0 ? categories.filter(c => c.user_id !== null).map(cat => ( // Show user-defined first
                            <TableRow key={cat.id}>
                                <TableCell className="font-medium">{cat.name}</TableCell>
                                <TableCell>{cat.type.charAt(0).toUpperCase() + cat.type.slice(1)}</TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: cat.color }}></span>
                                        {cat.color}
                                    </div>
                                </TableCell>
                                <TableCell>
                                     <div className="flex space-x-1">
                                        <Button variant="ghost" size="icon" onClick={() => alert(`Edit ${cat.id}`)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => alert(`Delete ${cat.id}`)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )) : (
                             <TableRow>
                                <TableCell colSpan={4} className="text-center text-gray-500">No custom categories created yet.</TableCell>
                            </TableRow>
                        )}
                         {/* Separator for default categories */}
                         <TableRow>
                            <TableCell colSpan={4} className="pt-4 pb-1 text-sm font-semibold text-gray-500">Default Categories</TableCell>
                         </TableRow>
                         {categories.filter(c => c.user_id === null).map(cat => (
                            <TableRow key={cat.id}>
                                <TableCell className="font-medium">{cat.name}</TableCell>
                                <TableCell>{cat.type.charAt(0).toUpperCase() + cat.type.slice(1)}</TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: cat.color }}></span>
                                        {cat.color}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {/* No actions for default categories */}
                                    <span className="text-xs text-gray-400">Default</span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
};

// Budgets Page
const Budgets = () => {
    const { budgets, categories } = useContext(AppContext);
    // Add state for adding/editing budgets

     const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Unknown Category';
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Budgets</h1>
                 <Button onClick={() => alert('Add Budget clicked!')}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Budget
                </Button>
            </div>

             {/* Add filter for month */}
             <div className="flex items-center space-x-2">
                 <Label htmlFor="budget-month">Month:</Label>
                 <Input id="budget-month" type="month" defaultValue="2025-04" className="w-auto"/>
             </div>

            <Card>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Month</TableHead>
                            <TableHead className="text-right">Limit</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {budgets.length > 0 ? budgets.map(budget => (
                            <TableRow key={budget.id}>
                                <TableCell className="font-medium">{getCategoryName(budget.category_id)}</TableCell>
                                <TableCell>{format(new Date(budget.month), 'MMMM yyyy')}</TableCell>
                                <TableCell className="text-right">${budget.amount_limit.toFixed(2)}</TableCell>
                                <TableCell>
                                     <div className="flex space-x-1">
                                        <Button variant="ghost" size="icon" onClick={() => alert(`Edit ${budget.id}`)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => alert(`Delete ${budget.id}`)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )) : (
                             <TableRow>
                                <TableCell colSpan={4} className="text-center text-gray-500">No budgets set for this month.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
};

// Goals Page
const Goals = () => {
    const { goals } = useContext(AppContext);
    // Add state for adding/editing goals

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Savings Goals</h1>
                 <Button onClick={() => alert('Add Goal clicked!')}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Goal
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.length > 0 ? goals.map(goal => {
                    const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
                    return (
                        <Card key={goal.id}>
                            <CardHeader>
                                <CardTitle>{goal.name}</CardTitle>
                                <CardDescription>Target: ${goal.target_amount.toFixed(2)}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-2">
                                    <div className="flex justify-between text-sm font-medium mb-1">
                                        <span>Progress</span>
                                        <span>${goal.current_amount.toFixed(2)} ({progress.toFixed(1)}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                                {goal.deadline && <p className="text-sm text-gray-600">Deadline: {format(new Date(goal.deadline), 'PPP')}</p>}
                            </CardContent>
                            <CardFooter className="flex justify-end space-x-1">
                                <Button variant="ghost" size="icon" onClick={() => alert(`Edit ${goal.id}`)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => alert(`Delete ${goal.id}`)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                }) : (
                    <p className="text-gray-500 md:col-span-2 lg:col-span-3">No savings goals have been set yet.</p>
                )}
            </div>
        </div>
    );
};


// Main App Component
function App() {
    const { currentPage } = useContext(AppContext);

    // Simple router
    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard />;
            case 'transactions':
                return <Transactions />;
            case 'categories':
                return <Categories />;
            case 'budgets':
                return <Budgets />;
            case 'goals':
                return <Goals />;
            default:
                return <Dashboard />; // Default to dashboard
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                {/* Placeholder for potential top bar/header */}
                {/* <header className="bg-white shadow-sm p-4">Header Content</header> */}
                {renderPage()}
            </main>
        </div>
    );
}

// Export the App component wrapped in the provider
export default function ProvidedApp() {
  // In a real app, you might fetch initial data here or in the provider
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
