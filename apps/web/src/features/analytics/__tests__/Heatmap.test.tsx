import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Heatmap from '../components/Heatmap';

describe('Heatmap', () => {
  it('renders without crashing', () => {
    const data = [{ date: new Date().toISOString(), metrics: { activity: 3 } }];
    const { container } = render(<Heatmap data={data} weeks={2} />);
    expect(container).toBeTruthy();
  });
});
