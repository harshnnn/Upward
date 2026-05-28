import React from 'react';
import { useJournalEntries, useCreateJournalEntry } from '../hooks';
import TimelineCard from '../components/TimelineCard';

export const JournalTimeline: React.FC = () => {
  const { data, isLoading } = useJournalEntries({});
  const create = useCreateJournalEntry();

  if (isLoading) return <div>Loading journal…</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Journal Timeline</h2>
      <div>
        <button onClick={() => create.mutate({ timestamp: new Date().toISOString(), content: 'Quick note', isPrivate: true })}>Quick Add</button>
      </div>
      <div style={{ marginTop: 12 }}>
        {data?.map((e: any) => (
          <TimelineCard key={e.id} entry={e} />
        ))}
      </div>
    </div>
  );
};

export default JournalTimeline;
