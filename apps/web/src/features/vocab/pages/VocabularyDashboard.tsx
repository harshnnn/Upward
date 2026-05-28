import React from 'react';
import QuickAddWord from '../components/QuickAddWord';
import { useVocabList } from '../hooks';

export const VocabularyDashboard: React.FC = () => {
  const { data: words } = useVocabList();

  return (
    <div style={{ padding: 16 }}>
      <h2>Vocabulary</h2>
      <QuickAddWord />
      <section style={{ marginTop: 12 }}>
        {words?.map((w: any) => (
          <div key={w.id}>{w.word} {w.isFavorite ? '★' : ''}</div>
        ))}
      </section>
    </div>
  );
};

export default VocabularyDashboard;
