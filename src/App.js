import React from 'react';
import { useAppContext, AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import './App.css'; // Main layout styles if needed
import './index.css';

// Main App Component - Handles Routing/Page Display
function App() {
    const { currentPage } = useAppContext(); // Use the custom hook

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
                {/* <header className="bg-white shadow-sm p-4 sticky top-0 z-10">Header Content</header> */}
                {renderPage()}
            </main>
        </div>
    );
}

// Export the App component wrapped in the provider
// This is the component that will be rendered in main.jsx
export default function ProvidedApp() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}