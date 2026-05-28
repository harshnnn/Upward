import React from 'react';
import { Card } from '@upward/ui';

export const TrackerCard: React.FC<{ name: string; type: string; onQuickAdd?: () => void }> = ({ name, type, onQuickAdd }) => {
  return (
    <Card style={{ padding: 12, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 700 }}>{name}</div>
          <div style={{ color: '#888' }}>{type}</div>
        </div>
        <div>
          <button onClick={onQuickAdd}>Quick</button>
        </div>
      </div>
    </Card>
  );
};

export default TrackerCard;
