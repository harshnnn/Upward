import { useAuth } from '../hooks/use-auth';

export const DashboardPage = () => {
  const { user, session, logout } = useAuth();

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <h1>Upward</h1>
      <p>Signed in as {user?.email}</p>
      <p>Session {session?.id}</p>
      <button onClick={() => void logout()}>Log out</button>
    </div>
  );
};
