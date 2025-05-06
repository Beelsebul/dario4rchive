import React, { useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { useAppContext } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

const Dashboard = () => {
    const { transactions, categories, budgets, goals } = useAppContext();

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
                        <CardTitle as="h2" className="text-sm font-medium text-gray-600">Total Income (Apr)</CardTitle>
                        <CardDescription className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle as="h2" className="text-sm font-medium text-gray-600">Total Expenses (Apr)</CardTitle>
                        <CardDescription className="text-2xl font-bold text-red-600">${totalExpense.toFixed(2)}</CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle as="h2" className="text-sm font-medium text-gray-600">Net Savings (Apr)</CardTitle>
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

export default Dashboard;