import React, { useState } from 'react';
import { useCreateWord } from '../hooks';

export const QuickAddWord: React.FC = () => {
  const [word, setWord] = useState('');
  const create = useCreateWord();

  return (
    <div style={{ padding: 8 }}>
      <input placeholder="Add word" value={word} onChange={(e) => setWord(e.target.value)} />
      <button onClick={() => { create.mutate({ word, language: 'en' }); setWord(''); }}>Add</button>
    </div>
  );
};

export default QuickAddWord;
