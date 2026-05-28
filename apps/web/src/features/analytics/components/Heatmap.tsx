import React, { useMemo } from 'react';

// GitHub-style calendar heatmap: columns = weeks, rows = weekdays
export const Heatmap: React.FC<{data: Array<{date: string, metrics?: any}>, weeks?: number}> = ({ data = [], weeks = 52 }) => {
  // normalize incoming data into a map by ISO date (YYYY-MM-DD)
  const map = useMemo(() => {
    const m: Record<string, any> = {};
    (data || []).forEach(d => {
      const key = d.date?.slice(0,10) ?? new Date(d.date).toISOString().slice(0,10);
      m[key] = d.metrics ?? {};
    });
    return m;
  }, [data]);

  // build week columns ending today
  const today = new Date();
  today.setHours(0,0,0,0);
  // find start date as weeks*7 days ago aligned to sunday
  const start = new Date(today);
  start.setDate(start.getDate() - (weeks * 7));

  // create matrix of weeks columns (each column has 7 days, Sunday..Saturday)
  const cols = [] as Array<Array<{date: Date, key: string, value: number}>>;
  for (let w = 0; w < weeks; w++) {
    const col: Array<{date: Date, key: string, value: number}> = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(start);
      day.setDate(start.getDate() + (w * 7) + d);
      const key = day.toISOString().slice(0,10);
      const metrics = map[key] ?? {};
      const value = metrics.activity ?? metrics.count ?? 0;
      col.push({ date: day, key, value });
    }
    cols.push(col);
  }

  // color scale helper
  const colorFor = (v: number) => {
    if (v <= 0) return '#ebedf0';
    if (v < 2) return '#c6e48b';
    if (v < 5) return '#7bc96f';
    if (v < 10) return '#239a3b';
    return '#196127';
  };

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {cols.map((col, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateRows: 'repeat(7, 12px)', gap: 4 }}>
          {col.map(cell => (
            <div key={cell.key} title={`${cell.key} — ${cell.value}`} style={{ width: 12, height: 12, background: colorFor(cell.value), borderRadius: 2 }} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Heatmap;
