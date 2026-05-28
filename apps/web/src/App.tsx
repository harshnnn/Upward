import { AppRouter } from './routes/app-router';
import { useAuthBootstrap } from './features/auth/hooks/use-auth-bootstrap';
import { useUiStore } from './app/state/ui-store';
import { useEffect } from 'react';

const App = () => {
  useAuthBootstrap();
  const closeCommandPalette = useUiStore((state) => state.closeCommandPalette);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCommandPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeCommandPalette]);

  return <AppRouter />;
};

export default App;
