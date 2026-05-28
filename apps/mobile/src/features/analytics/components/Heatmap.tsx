import React from 'react';
import { View } from 'react-native';

export const Heatmap: React.FC<{data: any[]}> = ({ data }) => {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {data?.map((d: any) => (
        <View key={d.date} style={{ width: 20, height: 20, margin: 2, backgroundColor: `rgba(30,150,30, ${Math.min(1, (d.metrics?.activity||0)/10)})` }} />
      ))}
    </View>
  );
};

export default Heatmap;
