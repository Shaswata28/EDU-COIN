import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { RegistrationForm } from './components/auth/RegistrationForm';
import { HomePage } from './pages/HomePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { PaymentPage } from './pages/PaymentPages';
import { WalletTopUpPage } from './pages/WalletTopUpPage';
import { TransactionHistoryPage } from './pages/TransactionHistoryPage';
import { UserAnalyticsPage } from './pages/UserAnalyticsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { HelpPage } from './pages/HelpPage';
import { VerifyPaymentPage } from './pages/VerifyPaymentPage';
import { BudgetPlannerPage } from './pages/BudgetPlannerPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';
import { ResetPasswordForm } from './components/auth/ResetPasswordForm';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/verify"
            element={
              <ProtectedRoute>
                <VerifyPaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/topup"
            element={
              <ProtectedRoute>
                <WalletTopUpPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <TransactionHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <UserAnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/budget"
            element={
              <ProtectedRoute>
                <BudgetPlannerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/achievements"
            element={
              <ProtectedRoute>
                <AchievementsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <HelpPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
