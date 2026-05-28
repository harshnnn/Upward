import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthForm, AuthField } from '../components/auth-form';
import { useAuth } from '../hooks/use-auth';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { signUp, status, error } = useAuth();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await signUp({ email, password, displayName, clientType: 'web' });
    navigate('/dashboard', { replace: true });
  };

  return (
    <AuthForm
      title="Create your account"
      subtitle="Set up your personal life operating system."
      submitLabel="Create account"
      error={error}
      loading={status === 'loading'}
      onSubmit={onSubmit}
      footer={<p>Already have an account? <Link to="/login">Log in</Link></p>}
    >
      <AuthField type="text" placeholder="Display name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
      <AuthField type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
      <AuthField type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
    </AuthForm>
  );
};
