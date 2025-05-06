import React from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAppContext } from '../context/AppContext';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';

const Goals = () => {
    const { goals } = useAppContext();
    // Add state for adding/editing goals modal if needed

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
                    const progressWidth = isNaN(progress) ? 0 : progress; // Handle potential NaN if target is 0
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
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${progressWidth}%` }}></div>
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
                    <div className="col-span-full text-center text-gray-500 py-10">
                         <Card className="max-w-md mx-auto">
                            <CardContent className="p-6">
                                <p>No savings goals have been set yet.</p>
                                <Button className="mt-4" onClick={() => alert('Add Goal clicked!')}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Goal
                                </Button>
                            </CardContent>
                         </Card>
                    </div>
                )}
            </div>
             {/* Add Modal component here for adding/editing goals */}
        </div>
    );
};

export default Goals;