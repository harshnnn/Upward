import React from 'react';
import { useSessions } from '../hooks';

export const WorkoutHistory: React.FC = () => {
  const { data: sessions } = useSessions();

  return (
    <div style={{ padding: 16 }}>
      <h2>Workout History</h2>
      <div>
        {sessions?.map((s: any) => (
          <div key={s.id} style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700 }}>{s.name ?? 'Workout'}</div>
            <div>{new Date(s.startedAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutHistory;
