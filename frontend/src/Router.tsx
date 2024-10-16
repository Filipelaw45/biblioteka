import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';

export function Router() {
  return (
    <Routes>
      <Route>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<div>Página não encontrada</div>} />
    </Routes>
  );
}
