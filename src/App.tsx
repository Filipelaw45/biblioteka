import { BrowserRouter } from 'react-router-dom';
import { Router } from './Router.tsx';

export function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}
