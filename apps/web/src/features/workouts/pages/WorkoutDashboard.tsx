import React from 'react';
import QuickWorkout from '../components/QuickWorkout';
import { usePRs } from '../hooks';

export const WorkoutDashboard: React.FC = () => {
  const { data: prs } = usePRs();

  return (
    <div style={{ padding: 16 }}>
      <h2>Workout Dashboard</h2>
      <QuickWorkout />
      <section style={{ marginTop: 16 }}>
        <h3>Recent PRs</h3>
        {prs?.length ? prs.map((p: any) => (<div key={p.id}>{p.metric} — {JSON.stringify(p.valueJson)}</div>)) : <div>No PRs yet</div>}
      </section>
    </div>
  );
};

export default WorkoutDashboard;
