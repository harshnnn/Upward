import React, { useState } from 'react';
import { useCreateSession } from '../hooks';

export const QuickWorkout: React.FC = () => {
  const [name, setName] = useState('');
  const create = useCreateSession();

  return (
    <div style={{ padding: 12 }}>
      <h3>Quick Start</h3>
      <input placeholder="Workout name" value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={() => create.mutate({ name })}>Start</button>
    </div>
  );
};

export default QuickWorkout;
