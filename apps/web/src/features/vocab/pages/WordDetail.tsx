import React from 'react';
import { useWord } from '../hooks';

export const WordDetail: React.FC<{id: string}> = ({ id }) => {
  const { data: w } = useWord(id);
  if (!w) return <div>Loading…</div>;
  return (
    <div style={{ padding: 16 }}>
      <h2>{w.word}</h2>
      <div>Pronunciation: {w.pronunciation}</div>
      <div>Meanings:
        <ul>{w.meanings?.map((m: any) => <li key={m.id}>{m.definition}</li>)}</ul>
      </div>
      <div>Sentences:
        <ul>{w.sentences?.map((s: any) => <li key={s.id}>{s.text}</li>)}</ul>
      </div>
    </div>
  );
};

export default WordDetail;
