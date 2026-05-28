import { useEffect } from 'react';

import { useAuth } from './use-auth';

export const useAuthBootstrap = (): void => {
  const bootstrap = useAuth((state) => state.bootstrap);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);
};
