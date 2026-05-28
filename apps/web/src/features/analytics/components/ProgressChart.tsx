import React from 'react';

export const ProgressChart: React.FC<{series: any[]}> = ({ series }) => {
  // minimal chart placeholder; consumer can swap with Chart.js or Recharts
  return (
    <div style={{ height: 160, background: '#0b0b0b', padding: 8 }}>
      <div style={{ color: '#fff' }}>Chart (placeholder)</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', height: 120 }}>
        {series?.map((p: any, i: number) => (
          <div key={i} style={{ width: 10, marginRight: 4, height: `${Math.max(2, (p.value||0))}px`, background: '#4ade80' }} />
        ))}
      </div>
    </div>
  );
};

export default ProgressChart;
