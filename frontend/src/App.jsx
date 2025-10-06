import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from './services/api';
import Header from './components/ui/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import EventCreationPage from './pages/event/EventCreationPage';
import EventListPage from './pages/event/EventListPage';
import EventViewPage from './pages/event/EventViewPage';
import TaskCreationPage from './pages/task/TaskCreationPage';
import TaskListPage from './pages/task/TaskListPage';

const ProtectedRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  return authenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  return !authenticated ? children : <Navigate to="/" />;
};

const PrivateLayout = ({ children }) => (
  <>
    <Header />
    {children}
  </>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PrivateLayout>
                <HomePage />
              </PrivateLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/event-create"
          element={
            <ProtectedRoute>
              <PrivateLayout>
                <EventCreationPage />
              </PrivateLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/event-list"
          element={
            <ProtectedRoute>
              <PrivateLayout>
                <EventListPage />
              </PrivateLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/event-view/:id"
          element={
            <ProtectedRoute>
              <PrivateLayout>
                <EventViewPage />
              </PrivateLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/task-create"
          element={
            <ProtectedRoute>
              <PrivateLayout>
                <TaskCreationPage />
              </PrivateLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/task-list"
          element={
            <ProtectedRoute>
              <PrivateLayout>
                <TaskListPage />
              </PrivateLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;