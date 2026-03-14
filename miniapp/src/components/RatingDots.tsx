import {View} from '@tarojs/components';
import React from 'react';

export function RatingDots({
  value,
  color,
}: {
  value: number;
  color: string;
}) {
  const dots = Array.from({length: 5}, (_, i) => i);
  return (
    <View style={{display: 'flex', gap: 4}}>
      {dots.map((i) => (
        <View
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: i < value ? color : '#e7e5e4',
          }}
        />
      ))}
    </View>
  );
}

