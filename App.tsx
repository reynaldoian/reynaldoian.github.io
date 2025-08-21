

import React, { useState, useCallback, useMemo } from 'react';
import { HashRouter, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { LayoutGrid, Banknote, PiggyBank, BarChart2, User, ShieldCheck } from 'lucide-react';
import DashboardPage from './components/pages/DashboardPage';
import DebtsPage from './components/pages/DebtsPage';
import DebtDetailPage from './components/pages/DebtDetailPage';
import GoalsPage from './components/pages/GoalsPage';
import AnalysisPage from './components/pages/AnalysisPage';
import ProfilePage from './components/pages/ProfilePage';
import { Debt, FinancialGoal, Asset, Transaction } from './types';
import PaymentModal from './components/PaymentModal';
import AddItemModal from './components/AddItemModal';
import ConfirmationModal from './components/ConfirmationModal';
import { useAuth } from './context/AuthContext';
import LoginPage from './components/pages/auth/LoginPage';
import RegisterPage from './components/pages/auth/RegisterPage';
import ForgotPasswordPage from './components/pages/auth/ForgotPasswordPage';
import BottomNavBar from './components/BottomNavBar';
import DebtSimulatorPage from './components/pages/DebtSimulatorPage';


type PaymentModalState = {
  isOpen: boolean;
  type: 'debt' | 'goal' | null;
  item: Debt | FinancialGoal | null;
};

type AddModalState = {
  isOpen: boolean;
  type: 'debt' | 'goal' | 'transaction' | null;
}

type EditModalState = {
  isOpen: boolean;
  type: 'debt' | 'goal' | 'transaction' | null;
  item: Debt | FinancialGoal | Transaction | null;
};

type ConfirmationModalState = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
    <li>
      <NavLink
        to={to}
        end={to === '/'}
        className={({ isActive }) =>
          `flex items-center p-3 my-1 rounded-lg text-gray-200 hover:bg-sky-700 transition-colors ${isActive ? 'bg-sky-600 font-semibold' : ''}`
        }
      >
        {icon}
        <span className="ml-3">{label}</span>
      </NavLink>
    </li>
);

const AuthenticatedApp: React.FC = () => {
   const navigate = useNavigate();
   // Mock Data
  const [debts, setDebts] = useState<Debt[]>([
    { id: 'd1', name: 'Tarjeta de Crédito', initialBalance: 5000, currentBalance: 4500, interestRate: 21.5, minimumPayment: 100, creditor: 'Banco A', debtType: 'revolving' },
    { id: 'd2', name: 'Préstamo Estudiantil', initialBalance: 20000, currentBalance: 18500, interestRate: 5.8, minimumPayment: 250, creditor: 'Gob', debtType: 'installment', termMonths: 120 },
    { id: 'd3', name: 'Alquiler Mensual', initialBalance: 0, currentBalance: 0, interestRate: 0, minimumPayment: 1250, creditor: 'Propietario', debtType: 'fixed-expense' },
  ]);
  const [goals, setGoals] = useState<FinancialGoal[]>([
    { id: 'g1', name: 'Fondo de Emergencia', targetAmount: 10000, currentAmount: 3500, deadline: '2025-12-31', priority: 'High' },
    { id: 'g2', name: 'Viaje a Japón', targetAmount: 8000, currentAmount: 1200, deadline: '2026-06-30', priority: 'Medium' },
  ]);
  const [assets] = useState<Asset[]>([
      { id: 'a1', name: 'Cuenta Corriente', type: 'Cash', value: 5000 },
      { id: 'a2', name: '401k', type: 'Investment', value: 25000 },
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([
      {id: 't1', type: 'income', category: 'Salario', amount: 5000, description: 'Salario Mensual', date: '2024-07-01'},
      {id: 't2', type: 'expense', category: 'Alquiler', amount: 1500, description: 'Alquiler de Julio', date: '2024-07-01'},
      {id: 't3', type: 'expense', category: 'Supermercado', amount: 400, description: 'Compras semanales', date: '2024-07-05'},
      {id: 't4', type: 'expense', category: 'Transporte', amount: 150, description: 'Gasolina', date: '2024-07-10'},
      {id: 't5', type: 'expense', category: 'Ocio', amount: 200, description: 'Cine y cena', date: '2024-07-12'},
      {id: 't6', type: 'income', category: 'Freelance', amount: 750, description: 'Proyecto de diseño', date: '2024-07-15'},
      {id: 't7', type: 'expense', category: 'Servicios', amount: 100, description: 'Factura de internet', date: '2024-07-18'},
  ]);
  
  const [paymentModalState, setPaymentModalState] = useState<PaymentModalState>({ isOpen: false, type: null, item: null });
  const [addModalState, setAddModalState] = useState<AddModalState>({ isOpen: false, type: null });
  const [editModalState, setEditModalState] = useState<EditModalState>({ isOpen: false, type: null, item: null });
  const [confirmationModalState, setConfirmationModalState] = useState<ConfirmationModalState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });


  const openPaymentModal = useCallback((item: Debt | FinancialGoal, type: 'debt' | 'goal') => {
    setPaymentModalState({ isOpen: true, type, item });
  }, []);

  const closePaymentModal = useCallback(() => {
    setPaymentModalState({ isOpen: false, type: null, item: null });
  }, []);

  const openAddModal = useCallback((type: 'debt' | 'goal' | 'transaction') => {
    setAddModalState({ isOpen: true, type });
  }, []);

  const closeAddModal = useCallback(() => {
    setAddModalState({ isOpen: false, type: null });
  }, []);

  const openEditModal = useCallback((item: Debt | FinancialGoal | Transaction, type: 'debt' | 'goal' | 'transaction') => {
    setEditModalState({ isOpen: true, type, item });
  }, []);

  const closeEditModal = useCallback(() => {
    setEditModalState({ isOpen: false, type: null, item: null });
  }, []);

  const closeConfirmationModal = useCallback(() => {
    setConfirmationModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  }, []);


  const handleRegisterPayment = (itemId: string, amount: number) => {
    const itemType = paymentModalState.type;
    let description = '';
    let category = 'Gasto';

    if (itemType === 'debt') {
        let debtName = '';
        setDebts(prevDebts => prevDebts.map(d => {
            if (d.id === itemId) {
                debtName = d.name;
                return { ...d, currentBalance: Math.max(0, d.currentBalance - amount) };
            }
            return d;
        }));
        description = `Pago a ${debtName}`;
        category = 'Pago de Deuda';
    } else if (itemType === 'goal') {
        let goalName = '';
        setGoals(prevGoals => prevGoals.map(g => {
            if (g.id === itemId) {
                goalName = g.name;
                return { ...g, currentAmount: g.currentAmount + amount };
            }
            return g;
        }));
        description = `Contribución a ${goalName}`;
        category = 'Ahorro / Metas';
    }

    if(itemType) {
        const newTransaction: Transaction = {
          id: crypto.randomUUID(),
          type: 'expense',
          category,
          amount,
          description,
          date: new Date().toISOString().split('T')[0],
          relatedItemId: itemId,
        };
        setTransactions(prev => [newTransaction, ...prev]);
    }
    closePaymentModal();
  };
  
  const handleAddItem = (item: Debt | FinancialGoal | Transaction) => {
    switch(addModalState.type) {
      case 'debt':
        setDebts(prev => [...prev, item as Debt]);
        break;
      case 'goal':
        setGoals(prev => [...prev, item as FinancialGoal]);
        break;
      case 'transaction':
        setTransactions(prev => [item as Transaction, ...prev]);
        break;
    }
    closeAddModal();
  };

  const handleUpdateDebt = (updatedDebt: Debt) => {
    setDebts(prev => prev.map(d => d.id === updatedDebt.id ? updatedDebt : d));
  };
  
  const handleUpdateItem = (item: Debt | FinancialGoal | Transaction) => {
    switch(editModalState.type) {
      case 'debt':
         setDebts(prev => prev.map(d => d.id === (item as Debt).id ? item as Debt : d));
        break;
      case 'goal':
        setGoals(prev => prev.map(g => g.id === (item as FinancialGoal).id ? item as FinancialGoal : g));
        break;
      // Handle other types if needed in the future
    }
    closeEditModal();
  };

  const handleDeleteDebt = (debtId: string) => {
    const debtToDelete = debts.find(d => d.id === debtId);
    if (!debtToDelete) return;

    const handleConfirmDelete = () => {
        setDebts(prev => prev.filter(d => d.id !== debtId));
        setTransactions(prev => prev.filter(t => t.relatedItemId !== debtId));
        closeConfirmationModal();
        navigate('/debts');
    };

    setConfirmationModalState({
        isOpen: true,
        title: `Eliminar "${debtToDelete.name}"`,
        message: `¿Estás seguro de que quieres eliminar este item? Esta acción no se puede deshacer y también eliminará todas las transacciones asociadas.`,
        onConfirm: handleConfirmDelete
    });
  };
  
  const handleDeleteGoal = (goalId: string) => {
    const goalToDelete = goals.find(g => g.id === goalId);
    if (!goalToDelete) return;

    const handleConfirmDelete = () => {
        setGoals(prev => prev.filter(g => g.id !== goalId));
        setTransactions(prev => prev.filter(t => t.relatedItemId !== goalId));
        closeConfirmationModal();
    };

    setConfirmationModalState({
        isOpen: true,
        title: `Eliminar Meta`,
        message: `¿Estás seguro de que quieres eliminar la meta "${goalToDelete.name}"? Esta acción es permanente y también eliminará todas las contribuciones asociadas.`,
        onConfirm: handleConfirmDelete
    });
  };

  const financialSummary = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const totalDebt = debts.filter(d => d.debtType !== 'fixed-expense').reduce((acc, d) => acc + d.currentBalance, 0);
    const netWorth = assets.reduce((acc, a) => acc + a.value, 0) - totalDebt;
    return { income, expenses, totalDebt, netWorth };
  }, [transactions, debts, assets]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <aside className="hidden md:flex w-64 flex-shrink-0 bg-gray-800 dark:bg-gray-900 p-4 flex-col shadow-lg">
          <div className="flex items-center mb-8">
            <ShieldCheck className="w-10 h-10 text-sky-400" />
            <h1 className="text-2xl font-bold text-white ml-2">NieveCero</h1>
          </div>
          <nav>
            <ul>
              <NavItem to="/" icon={<LayoutGrid className="w-6 h-6"/>} label="Panel" />
              <NavItem to="/debts" icon={<Banknote className="w-6 h-6"/>} label="Deudas" />
              <NavItem to="/goals" icon={<PiggyBank className="w-6 h-6"/>} label="Metas" />
              <NavItem to="/analysis" icon={<BarChart2 className="w-6 h-6"/>} label="Reportes" />
              <NavItem to="/profile" icon={<User className="w-6 h-6"/>} label="Perfil" />
            </ul>
          </nav>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-4 md:p-6 pb-24 md:pb-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<DashboardPage summary={financialSummary} goals={goals} transactions={transactions} openAddModal={openAddModal} />} />
              <Route path="/debts" element={<DebtsPage debts={debts} onOpenAddModal={() => openAddModal('debt')}/>} />
              <Route path="/debts/simulator" element={<DebtSimulatorPage debts={debts} />} />
              <Route path="/debts/:debtId" element={<DebtDetailPage 
                  debts={debts} 
                  transactions={transactions}
                  summary={financialSummary}
                  onOpenPaymentModal={openPaymentModal}
                  onUpdateDebt={handleUpdateDebt}
                  onDeleteDebt={handleDeleteDebt}
                  onOpenEditModal={(debt) => openEditModal(debt, 'debt')}
              />} />
              <Route path="/goals" element={<GoalsPage goals={goals} onContribute={openPaymentModal} onOpenAddModal={() => openAddModal('goal')} onOpenEditModal={(goal) => openEditModal(goal, 'goal')} onDeleteGoal={handleDeleteGoal} />} />
              <Route path="/analysis" element={<AnalysisPage debts={debts} goals={goals} assets={assets} summary={financialSummary} />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      
      <BottomNavBar />

      {paymentModalState.isOpen && paymentModalState.item && paymentModalState.type && (
          <PaymentModal
              isOpen={paymentModalState.isOpen}
              onClose={closePaymentModal}
              item={paymentModalState.item}
              type={paymentModalState.type}
              onConfirm={handleRegisterPayment}
          />
      )}
      {addModalState.isOpen && addModalState.type && (
          <AddItemModal
              isOpen={addModalState.isOpen}
              onClose={closeAddModal}
              type={addModalState.type}
              onSubmit={handleAddItem}
          />
      )}
      {editModalState.isOpen && editModalState.type && editModalState.item && (
          <AddItemModal
              isOpen={editModalState.isOpen}
              onClose={closeEditModal}
              type={editModalState.type}
              onSubmit={handleUpdateItem}
              itemToEdit={editModalState.item}
          />
      )}
      {confirmationModalState.isOpen && (
        <ConfirmationModal
          isOpen={confirmationModalState.isOpen}
          onClose={closeConfirmationModal}
          onConfirm={confirmationModalState.onConfirm}
          title={confirmationModalState.title}
          message={confirmationModalState.message}
        />
      )}
    </div>
  )
}


const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <HashRouter>
      <Routes>
        {isAuthenticated ? (
          <Route path="/*" element={<AuthenticatedApp />} />
        ) : (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </HashRouter>
  );
};

export default App;