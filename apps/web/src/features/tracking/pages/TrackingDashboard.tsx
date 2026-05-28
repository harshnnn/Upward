import React from 'react';
import { useTrackers, useCreateEntry } from '../hooks';
import TrackerCard from '../components/TrackerCard';

export const TrackingDashboard: React.FC = () => {
  const { data, isLoading } = useTrackers(1);
  const createEntry = useCreateEntry();

  if (isLoading) return <div>Loading trackers…</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Trackers</h2>
      <div>
        {data?.map((t: any) => (
          <TrackerCard key={t.id} name={t.name} type={t.type} onQuickAdd={() => createEntry.mutate({ trackerId: t.id, date: new Date().toISOString().slice(0, 10) })} />
        ))}
      </div>
    </div>
  );
};

export default TrackingDashboard;
