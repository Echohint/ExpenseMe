import { useExpenses } from '../context/ExpenseContext';
import { format } from 'date-fns';
import { MoreVertical } from 'lucide-react';

const RecentTransactions = () => {
    const { expenses, filters, setFilters } = useExpenses();

    return (
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 style={{ fontSize: '1.1rem' }}>Recent Transactions</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Review your latest spending activity.</p>
                </div>
                <div className="flex gap-2">
                    <select
                        className="form-control"
                        style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                        <option>All Categories</option>
                        <option>Food & Dining</option>
                        <option>Transportation</option>
                        <option>Utilities</option>
                        <option>Shopping</option>
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
                            <th className="text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                    No expenses found.
                                </td>
                            </tr>
                        ) : (
                            expenses.slice(0, 5).map(exp => (
                                <tr key={exp._id}>
                                    <td style={{ color: 'var(--text-secondary)' }}>{format(new Date(exp.date), 'MMM dd, yyyy')}</td>
                                    <td style={{ fontWeight: 500 }}>{exp.description || 'No Description'}</td>
                                    <td>
                                        <span className="status-pill status-synced" style={{ background: 'var(--primary-light)', color: 'var(--primary-color)' }}>
                                            {exp.category}
                                        </span>
                                    </td>
                                    <td className="text-right" style={{ fontWeight: 600 }}>₹{exp.amount}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentTransactions;
