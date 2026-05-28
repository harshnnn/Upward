import React from 'react';
import { View } from 'react-native';

export const ProgressChart: React.FC<{series: any[]}> = ({ series }) => {
  return (
    <View style={{ height: 120, backgroundColor: '#0b0b0b', padding: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 100 }}>
        {series?.map((p: any, i: number) => (
          <View key={i} style={{ width: 6, marginRight: 4, height: Math.max(4, (p.value||0)), backgroundColor: '#4ade80' }} />
        ))}
      </View>
    </View>
  );
};

export default ProgressChart;
