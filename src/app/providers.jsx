import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store.js';
import { useBootstrapAuth } from '../hooks/useBootstrapAuth.js';

function AuthBootstrapper({ children }) {
  useBootstrapAuth();
  return children;
}

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthBootstrapper>{children}</AuthBootstrapper>
      </BrowserRouter>
    </Provider>
  );
}