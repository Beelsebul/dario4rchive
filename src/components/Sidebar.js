import React from 'react';
import { Home, List, Tag, DollarSign, Target, Settings, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext'; // Use the custom hook

const Sidebar = () => {
    const { currentPage, setCurrentPage } = useAppContext(); // Use the custom hook
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

export default Sidebar;