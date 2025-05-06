import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Label from '../components/ui/Label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';

const Categories = () => {
    const { categories, addCategory, updateCategory, deleteCategory } = useAppContext();
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentItem, setCurrentItem] = useState(null); // Category being edited

    const userCategories = categories.filter(c => c.user_id !== null);
    const defaultCategories = categories.filter(c => c.user_id === null);

    const handleOpenAddModal = () => {
        setCurrentItem(null);
        setModalMode('add');
        setShowModal(true);
    };

    const handleOpenEditModal = (category) => {
        if (category.user_id === null) {
            alert("Default categories cannot be edited.");
            return;
        }
        setCurrentItem(category);
        setModalMode('edit');
        setShowModal(true);
    };

    const handleDelete = (categoryId, categoryName) => {
        if (categories.find(c => c.id === categoryId)?.user_id === null) {
            alert("Default categories cannot be deleted.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete the category "${categoryName}"? This cannot be undone.`)) {
            deleteCategory(categoryId);
            alert(`Category "${categoryName}" deleted.`);
            // Note: Consider implications on existing transactions using this category.
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const categoryData = {
            name: formData.get('name'),
            type: formData.get('type'),
            color: formData.get('color'),
        };

        // Basic validation
        if (!categoryData.name || !categoryData.type || !categoryData.color) {
            alert('Please fill in all fields.');
            return;
        }
        // Validate color format (basic hex)
        if (!/^#[0-9A-F]{6}$/i.test(categoryData.color)) {
            alert('Please enter a valid hex color code (e.g., #RRGGBB).');
            return;
        }

        if (modalMode === 'add') {
            addCategory(categoryData);
            alert(`Category "${categoryData.name}" added!`);
        } else if (modalMode === 'edit' && currentItem) {
            updateCategory({ ...currentItem, ...categoryData });
            alert(`Category "${categoryData.name}" updated!`);
        }
        setShowModal(false);
        setCurrentItem(null);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Categories</h1>
                <Button onClick={handleOpenAddModal} className="button button-primary">
                    <PlusCircle className="button-icon-left" /> Add Category
                </Button>
            </div>
            <Card className="card">
                <Table className="table">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Color</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* User Categories */}
                        {userCategories.length === 0 && defaultCategories.length > 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="table-empty-state">You haven't created any custom categories yet.</TableCell>
                            </TableRow>
                        )}
                        {userCategories.map(cat => (
                            <TableRow key={cat.id}>
                                <TableCell className="font-medium">{cat.name}</TableCell>
                                <TableCell>{cat.type.charAt(0).toUpperCase() + cat.type.slice(1)}</TableCell>
                                <TableCell>
                                    <div className="color-cell">
                                        <span className="color-swatch" style={{ backgroundColor: cat.color }}></span>
                                        {cat.color}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="action-buttons">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenEditModal(cat)} className="button-icon button-ghost">
                                            <Edit className="icon-sm" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id, cat.name)} className="button-icon button-ghost button-danger">
                                            <Trash2 className="icon-sm" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}

                        {/* Default Categories Separator and Header (only if default exist) */}
                        {defaultCategories.length > 0 && (
                            <TableRow className="table-section-header-row">
                                <TableCell colSpan={4} className="table-section-header">Default Categories</TableCell>
                            </TableRow>
                        )}

                        {/* Default Categories */}
                        {defaultCategories.map(cat => (
                            <TableRow key={cat.id} className="table-row-default">
                                <TableCell className="font-medium">{cat.name}</TableCell>
                                <TableCell>{cat.type.charAt(0).toUpperCase() + cat.type.slice(1)}</TableCell>
                                <TableCell>
                                    <div className="color-cell">
                                        <span className="color-swatch" style={{ backgroundColor: cat.color }}></span>
                                        {cat.color}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="default-tag">Default</span>
                                </TableCell>
                            </TableRow>
                        ))}

                        {/* If no categories at all */}
                        {userCategories.length === 0 && defaultCategories.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="table-empty-state">No categories found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Add/Edit Category Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <Card className="modal-content card">
                        <form onSubmit={handleSubmit}>
                            <CardHeader>
                                <CardTitle>{modalMode === 'add' ? 'Add New Category' : 'Edit Category'}</CardTitle>
                            </CardHeader>
                            <CardContent className="modal-body">
                                <div className="form-group">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" required defaultValue={currentItem?.name || ''} className="input-field" />
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="type">Type</Label>
                                    <Select id="type" name="type" required defaultValue={currentItem?.type || 'expense'} className="select-field">
                                        <option value="expense">Expense</option>
                                        <option value="income">Income</option>
                                    </Select>
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="color">Color (Hex Code)</Label>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                        <Input id="color-text" name="color" type="text" required defaultValue={currentItem?.color || '#'} placeholder="#RRGGBB" pattern="^#[0-9A-Fa-f]{6}$" title="Enter a valid hex color like #FF0000" className="input-field" style={{flexGrow: 1}}/>
                                        <Input id="color-picker" type="color" defaultValue={currentItem?.color || '#ffffff'} onChange={(e) => document.getElementById('color-text').value = e.target.value} style={{ height: '40px', padding: '2px', border: 'none', cursor: 'pointer'}} />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="modal-footer">
                                <Button variant="outline" type="button" onClick={() => setShowModal(false)} className="button button-outline">Cancel</Button>
                                <Button type="submit" className="button button-primary">{modalMode === 'add' ? 'Add Category' : 'Save Changes'}</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Categories;