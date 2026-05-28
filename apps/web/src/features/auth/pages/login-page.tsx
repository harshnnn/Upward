import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthForm, AuthField } from '../components/auth-form';
import { useAuth } from '../hooks/use-auth';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn, status, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await signIn({ email, password, clientType: 'web' });
    navigate('/dashboard', { replace: true });
  };

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Sign in to continue tracking your life operating system."
      submitLabel="Log in"
      error={error}
      loading={status === 'loading'}
      onSubmit={onSubmit}
      footer={<p>Need an account? <Link to="/signup">Create one</Link></p>}
    >
      <AuthField type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
      <AuthField type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
    </AuthForm>
  );
};
