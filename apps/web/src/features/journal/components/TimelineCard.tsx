import React from 'react';

export const TimelineCard: React.FC<{ entry: any; onEdit?: () => void }> = ({ entry, onEdit }) => {
  return (
    <div style={{ padding: 12, marginBottom: 8, background: '#0f1720', borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 700 }}>{entry.title ?? 'Untitled'}</div>
          <div style={{ color: '#8b8b8b' }}>{new Date(entry.timestamp).toLocaleString()}</div>
        </div>
        <div>
          <button onClick={onEdit}>Edit</button>
        </div>
      </div>
      <div style={{ marginTop: 8 }}>{entry.content}</div>
    </div>
  );
};

export default TimelineCard;
