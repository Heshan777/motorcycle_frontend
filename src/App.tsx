import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/ToastContainer';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { FeedbackProvider } from './context/FeedbackContext';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminMotorcyclesPage } from './pages/AdminMotorcyclesPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminFeedbackPage } from './pages/AdminFeedbackPage';
import { BookingsPage } from './pages/BookingsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { HomePage } from './pages/HomePage';
import { LeasingOfferPage } from './pages/LeasingOfferPage';
import { LoginPage } from './pages/LoginPage';
import { MotorcycleDetailsPage } from './pages/MotorcycleDetailsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProfilePage } from './pages/ProfilePage';
import { RegisterPage } from './pages/RegisterPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { FAQPage } from './pages/FAQPage';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <WishlistProvider>
          <FeedbackProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="/leasing-offer" element={<LeasingOfferPage />} />
                <Route path="/contact-us" element={<ContactUsPage />} />
                <Route path="/compare" element={<ComparisonPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/motorcycles/:identifier" element={<MotorcycleDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/bookings" element={<BookingsPage />} />
                </Route>

                <Route element={<ProtectedRoute adminOnly />}>
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/motorcycles" element={<AdminMotorcyclesPage />} />
                  <Route path="/admin/users" element={<AdminUsersPage />} />
                  <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
                <Route path="" element={<Navigate replace to="/" />} />
              </Route>
            </Routes>
            <ToastContainer />
          </BrowserRouter>
        </FeedbackProvider>
        </WishlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
