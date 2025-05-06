import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAppContext } from '../context/AppContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Label from '../components/ui/Label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';

const Transactions = () => {
    const { transactions, categories, addTransaction, updateTransaction, deleteTransaction } = useAppContext();
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentItem, setCurrentItem] = useState(null); // Transaction being edited

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Uncategorized';
    };

    const handleOpenAddModal = () => {
        setCurrentItem(null);
        setModalMode('add');
        setShowModal(true);
    };

    const handleOpenEditModal = (transaction) => {
        setCurrentItem(transaction);
        setModalMode('edit');
        setShowModal(true);
    };

    const handleDelete = (transactionId) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            deleteTransaction(transactionId);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const transactionData = {
            type: formData.get('type'),
            amount: parseFloat(formData.get('amount')),
            category_id: formData.get('category_id'),
            date: formData.get('date'),
            description: formData.get('description'),
        };

        // Basic validation
        if (!transactionData.type || isNaN(transactionData.amount) || !transactionData.category_id || !transactionData.date) {
             alert('Please fill in all required fields correctly.');
             return;
        }


        if (modalMode === 'add') {
            addTransaction(transactionData);
            alert("Transaction added!");
        } else if (modalMode === 'edit' && currentItem) {
            updateTransaction({ ...currentItem, ...transactionData });
             alert("Transaction updated!");
        }
        setShowModal(false);
        setCurrentItem(null);
    };

     // Sort transactions by date descending for display
     const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));


    return (
        <div className="page-container"> {/* Use class for page styling */}
            <div className="page-header">
                <h1 className="page-title">Transactions</h1>
                <Button onClick={handleOpenAddModal} className="button button-primary">
                    <PlusCircle className="button-icon-left" /> Add Transaction
                </Button>
            </div>

            {/* Filters (Add functionality later) */}
            <div className="filter-bar">
                 {/* Wrap labels and inputs for better layout */}
                <div className="filter-item">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input id="start-date" type="date" placeholder="Start Date" className="input-field"/>
                </div>
                 <div className="filter-item">
                     <Label htmlFor="end-date">End Date</Label>
                    <Input id="end-date" type="date" placeholder="End Date" className="input-field"/>
                 </div>
                 <div className="filter-item">
                     <Label htmlFor="filter-category">Category</Label>
                    <Select id="filter-category" className="select-field">
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </Select>
                 </div>
                 <div className="filter-item">
                    <Label htmlFor="filter-type">Type</Label>
                    <Select id="filter-type" className="select-field">
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </Select>
                 </div>
                <Button variant="outline" className="button button-outline">Apply Filters</Button>
            </div>

            {/* Transaction Table */}
            <Card className="card">
                <Table className="table">
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
                        {sortedTransactions.length > 0 ? sortedTransactions.map(t => (
                            <TableRow key={t.id}>
                                <TableCell>{format(new Date(t.date), 'PPP')}</TableCell>
                                <TableCell>
                                    <span className={`status-badge ${t.type === 'income' ? 'status-badge-green' : 'status-badge-red'}`}>
                                        {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                                    </span>
                                </TableCell>
                                <TableCell>{getCategoryName(t.category_id)}</TableCell>
                                <TableCell>{t.description || '-'}</TableCell>
                                <TableCell className={`text-right font-medium ${t.type === 'income' ? 'text-green' : 'text-red'}`}>
                                    ${t.amount.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    <div className="action-buttons">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenEditModal(t)} className="button-icon button-ghost">
                                            <Edit className="icon-sm" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)} className="button-icon button-ghost button-danger">
                                            <Trash2 className="icon-sm" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} className="table-empty-state">No transactions found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Add/Edit Transaction Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <Card className="modal-content card">
                        <form onSubmit={handleSubmit}>
                            <CardHeader>
                                <CardTitle>{modalMode === 'add' ? 'Add New Transaction' : 'Edit Transaction'}</CardTitle>
                            </CardHeader>
                            <CardContent className="modal-body">
                                <div className="form-grid"> {/* Use grid for layout */}
                                     <div className="form-group">
                                        <Label htmlFor="type">Type</Label>
                                        <Select id="type" name="type" required defaultValue={currentItem?.type || 'expense'} className="select-field">
                                            <option value="expense">Expense</option>
                                            <option value="income">Income</option>
                                        </Select>
                                    </div>
                                    <div className="form-group">
                                        <Label htmlFor="amount">Amount</Label>
                                        <Input id="amount" name="amount" type="number" step="0.01" placeholder="0.00" required defaultValue={currentItem?.amount || ''} className="input-field"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="category">Category</Label>
                                    <Select id="category" name="category_id" required defaultValue={currentItem?.category_id || ''} className="select-field">
                                        <option value="" disabled>Select a category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
                                    </Select>
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="date">Date</Label>
                                    <Input id="date" name="date" type="date" required defaultValue={currentItem?.date || format(new Date(), 'yyyy-MM-dd')} className="input-field"/>
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Input id="description" name="description" placeholder="e.g., Coffee with friend" defaultValue={currentItem?.description || ''} className="input-field"/>
                                </div>
                            </CardContent>
                            <CardFooter className="modal-footer">
                                <Button variant="outline" type="button" onClick={() => setShowModal(false)} className="button button-outline">Cancel</Button>
                                <Button type="submit" className="button button-primary">{modalMode === 'add' ? 'Add Transaction' : 'Save Changes'}</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Transactions;