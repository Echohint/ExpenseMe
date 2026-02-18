import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useExpenses } from '../context/ExpenseContext';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

const History = () => {
    const { expenses, deleteExpense, filters, setFilters } = useExpenses();

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar title="Expense History" />

                <div className="card" style={{ marginTop: '2rem' }}>

                    <div className="flex items-center justify-between mb-6">
                        <input
                            type="text"
                            placeholder="Search by description..."
                            className="form-control"
                            style={{ maxWidth: '300px' }}
                        // Search logic could be client-side for now
                        />

                        <div className="flex gap-4">
                            <select
                                className="form-control"
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            >
                                <option>All Categories</option>
                                <option>Food & Dining</option>
                                <option>Transportation</option>
                                <option>Utilities</option>
                                <option>Shopping</option>
                                <option>Health & Fitness</option>
                                <option>Travel</option>
                                <option>Personal Care</option>
                                <option>Education</option>
                                <option>Entertainment</option>
                                <option>Others</option>
                            </select>

                            <select
                                className="form-control"
                                value={filters.sort}
                                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                            >
                                <option>Newest First</option>
                                <option>Oldest First</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th className="text-right">Amount</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                            No expenses found.
                                        </td>
                                    </tr>
                                ) : (
                                    expenses.map(exp => (
                                        <tr key={exp._id}>
                                            <td style={{ color: 'var(--text-secondary)' }}>{format(new Date(exp.date), 'MMM dd, yyyy')}</td>
                                            <td style={{ fontWeight: 500 }}>
                                                <div className="flex items-center gap-2">
                                                    {/* Icon based on category could go here */}
                                                    {exp.description || 'No Description'}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="status-pill status-synced" style={{ background: 'var(--primary-light)', color: 'var(--primary-color)' }}>
                                                    {exp.category}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="status-pill status-synced">Synced</span>
                                            </td>
                                            <td className="text-right" style={{ fontWeight: 600 }}>₹{exp.amount}</td>
                                            <td className="text-right">
                                                <button
                                                    onClick={() => deleteExpense(exp._id)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History;
