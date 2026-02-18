import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
    const { token } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        category: 'All Categories',
        sort: 'Newest First',
        startDate: '',
        endDate: ''
    });

    const getExpenses = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/expenses', { params: filters });
            setExpenses(res.data);
        } catch (err) {
            console.error('Error fetching expenses:', err);
        } finally {
            setLoading(false);
        }
    };

    const getAnalytics = async () => {
        if (!token) return;
        try {
            const res = await axios.get('http://localhost:5000/api/analytics');
            setAnalytics(res.data);
        } catch (err) {
            console.error('Error fetching analytics:', err);
        }
    };

    const addExpense = async (expenseData) => {
        try {
            const res = await axios.post('http://localhost:5000/api/expenses', expenseData);
            setExpenses([res.data, ...expenses]);
            getAnalytics(); // Refresh analytics
            return true;
        } catch (err) {
            console.error('Error adding expense:', err);
            return false;
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/expenses/${id}`);
            setExpenses(expenses.filter(exp => exp._id !== id));
            getAnalytics();
        } catch (err) {
            console.error('Error deleting expense:', err);
        }
    };

    useEffect(() => {
        getExpenses();
    }, [token, filters]);

    useEffect(() => {
        if (token) getAnalytics();
    }, [token]);

    return (
        <ExpenseContext.Provider value={{
            expenses,
            analytics,
            loading,
            filters,
            setFilters,
            addExpense,
            deleteExpense,
            getExpenses
        }}>
            {children}
        </ExpenseContext.Provider>
    );
};
