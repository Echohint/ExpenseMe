import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import ExpenseForm from '../components/ExpenseForm';
import RecentTransactions from '../components/RecentTransactions';

const Dashboard = () => {
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar title="Dashboard" />

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gap: '2rem',
                    marginTop: '2rem',
                    height: 'calc(100vh - 140px)'
                }}>
                    <div style={{ minWidth: '350px' }}>
                        <ExpenseForm />
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <RecentTransactions />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
