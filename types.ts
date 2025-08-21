
export interface Debt {
  id: string;
  name: string;
  initialBalance: number;
  currentBalance: number;
  interestRate: number;
  minimumPayment: number;
  creditor: string;
  debtType: 'revolving' | 'installment' | 'fixed-expense';
  termMonths?: number;
}

export interface FinancialGoal {
  id: string;
  name:string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  relatedItemId?: string; // Link to a debt or goal
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  value: number;
}

export interface FinancialHealthAnalysis {
  score: number;
  level: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement';
  analysis: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface DebtStrategyAnalysis {
  recommendation: 'snowball' | 'avalanche';
  reasoning: string;
  snowball: {
    analysis: string;
    totalInterest: number;
    payoffTimeMonths: number;
  };
  avalanche: {
    analysis: string;
    totalInterest: number;
    payoffTimeMonths: number;
  };
}

export interface User {
  name: string;
  email: string;
  avatarUrl?: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
  };
}