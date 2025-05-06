import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAppContext } from '../context/AppContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';
import Select from '../components/ui/Select'; // Import Select
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card'; // Import Card components
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';

const Budgets = () => {
    const { budgets, categories, addBudget, updateBudget, deleteBudget } = useAppContext();
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentItem, setCurrentItem] = useState(null); // Budget being edited
    const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM')); // Default to current month

     const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Unknown Category';
    };

    const handleOpenAddModal = () => {
        setCurrentItem(null);
        setModalMode('add');
        setShowModal(true);
    };

    const handleOpenEditModal = (budget) => {
        setCurrentItem(budget);
        setModalMode('edit');
        setShowModal(true);
    };

    const handleDelete = (budgetId, categoryName, month) => {
        if (window.confirm(`Are you sure you want to delete the budget for "${categoryName}" in ${format(new Date(month), 'MMMM yyyy')}?`)) {
            deleteBudget(budgetId);
            alert('Budget deleted.');
        }
    };

     const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const budgetData = {
            category_id: formData.get('category_id'),
            month: formData.get('month'), // format YYYY-MM
            amount_limit: parseFloat(formData.get('amount_limit')),
        };

        // Basic validation
        if (!budgetData.category_id || !budgetData.month || isNaN(budgetData.amount_limit) || budgetData.amount_limit <= 0) {
             alert('Please fill in all fields correctly. Amount must be positive.');
             return;
        }
        // Check for duplicate budget (same category, same month)
        const existing = budgets.find(b => b.category_id === budgetData.category_id && b.month.startsWith(budgetData.month) && b.id !== currentItem?.id);
        if (existing) {
            alert(`A budget for ${getCategoryName(budgetData.category_id)} already exists for ${format(new Date(budgetData.month + '-01'), 'MMMM yyyy')}.`);
            return;
        }


        if (modalMode === 'add') {
            addBudget(budgetData);
            alert("Budget added!");
        } else if (modalMode === 'edit' && currentItem) {
            updateBudget({ ...currentItem, ...budgetData });
             alert("Budget updated!");
        }
        setShowModal(false);
        setCurrentItem(null);
    };

    // Filter budgets based on selected month
    const filteredBudgets = budgets.filter(budget => budget.month.startsWith(selectedMonth));

    // Filter categories to only show 'expense' types for budgeting
    const expenseCategories = categories.filter(c => c.type === 'expense');

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Budgets</h1>
                 <Button onClick={handleOpenAddModal} className="button button-primary">
                    <PlusCircle className="button-icon-left" /> Add Budget
                </Button>
            </div>

             {/* Filter for month */}
             <div className="filter-bar">
                 <div className="filter-item">
                     <Label htmlFor="budget-month">Month:</Label>
                     <Input
                        id="budget-month"
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="input-field"/>
                 </div>
             </div>

            <Card className="card">
                 <Table className="table">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Month</TableHead>
                            <TableHead className="text-right">Limit</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBudgets.length > 0 ? filteredBudgets.map(budget => (
                            <TableRow key={budget.id}>
                                <TableCell className="font-medium">{getCategoryName(budget.category_id)}</TableCell>
                                <TableCell>{format(new Date(budget.month), 'MMMM yyyy')}</TableCell>
                                <TableCell className="text-right">${budget.amount_limit.toFixed(2)}</TableCell>
                                <TableCell>
                                     <div className="action-buttons">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenEditModal(budget)} className="button-icon button-ghost">
                                            <Edit className="icon-sm" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(budget.id, getCategoryName(budget.category_id), budget.month)} className="button-icon button-ghost button-danger">
                                            <Trash2 className="icon-sm" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )) : (
                             <TableRow>
                                <TableCell colSpan={4} className="table-empty-state">No budgets set for {format(new Date(selectedMonth + '-01'), 'MMMM yyyy')}.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

             {/* Add/Edit Budget Modal */}
             {showModal && (
                <div className="modal-overlay">
                    <Card className="modal-content card">
                        <form onSubmit={handleSubmit}>
                            <CardHeader>
                                <CardTitle>{modalMode === 'add' ? 'Add New Budget' : 'Edit Budget'}</CardTitle>
                            </CardHeader>
                            <CardContent className="modal-body">
                                 <div className="form-group">
                                    <Label htmlFor="category_id">Category (Expense Only)</Label>
                                    <Select id="category_id" name="category_id" required defaultValue={currentItem?.category_id || ''} className="select-field" disabled={modalMode === 'edit'}>
                                        <option value="" disabled>Select an expense category</option>
                                        {expenseCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </Select>
                                     {modalMode === 'edit' && <p className="form-help-text">Category cannot be changed after creation.</p>}
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="month">Month</Label>
                                    <Input id="month" name="month" type="month" required defaultValue={currentItem?.month ? currentItem.month.substring(0, 7) : selectedMonth} className="input-field" disabled={modalMode === 'edit'}/>
                                     {modalMode === 'edit' && <p className="form-help-text">Month cannot be changed after creation.</p>}
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="amount_limit">Amount Limit</Label>
                                    <Input id="amount_limit" name="amount_limit" type="number" step="0.01" placeholder="0.00" required defaultValue={currentItem?.amount_limit || ''} className="input-field"/>
                                </div>
                            </CardContent>
                            <CardFooter className="modal-footer">
                                <Button variant="outline" type="button" onClick={() => setShowModal(false)} className="button button-outline">Cancel</Button>
                                <Button type="submit" className="button button-primary">{modalMode === 'add' ? 'Add Budget' : 'Save Changes'}</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Budgets;