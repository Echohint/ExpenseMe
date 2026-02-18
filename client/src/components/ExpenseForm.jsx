import { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Plus, Calendar, Tag, FileText } from 'lucide-react';

const ExpenseForm = () => {
    const { addExpense } = useExpenses();
    const [formData, setFormData] = useState({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Food & Dining',
        description: ''
    });

    const categories = ['Food & Dining', 'Transportation', 'Utilities', 'Shopping', 'Health & Fitness', 'Travel', 'Personal Care', 'Education', 'Entertainment', 'Others'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addExpense(formData);
        setFormData({ ...formData, amount: '', description: '' });
    };

    return (
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--primary-color)', color: 'white', borderRadius: '50%', padding: '0.25rem' }}>
                    <Plus size={20} />
                </div>
                <h3 style={{ fontSize: '1.1rem' }}>Add New Expense</h3>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Log a new transaction to track your spending.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                    <label className="input-label">Amount</label>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 600 }}>₹</span>
                        <input
                            type="number"
                            className="form-control"
                            style={{ paddingLeft: '2rem' }}
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="0.00"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="input-label">Date</label>
                    <div style={{ position: 'relative' }}>
                        <Calendar size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="date"
                            className="form-control"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="input-label">Category</label>
                    <div style={{ position: 'relative' }}>
                        <select
                            className="form-control"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="input-label">Description (Optional)</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="What was this expense for?"
                    />
                </div>

                <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '0.5rem' }}>
                    Save Expense
                </button>
            </form>
        </div>
    );
};

export default ExpenseForm;
