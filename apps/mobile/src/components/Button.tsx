import React from 'react';
import type { PressableProps } from 'react-native';
import { Pressable, Text } from 'react-native';
import { Button as UiButton } from '@upward/ui';

type Props = PressableProps & { title?: string };

export const Button: React.FC<Props> = ({ title, children, ...rest }) => {
  // Prefer design-system Button when available
  try {
    // @ts-ignore
    return <UiButton {...(rest as any)}>{children ?? title}</UiButton>;
  } catch (e) {
    return (
      <Pressable {...rest} style={[{ padding: 12, backgroundColor: '#111', borderRadius: 8 }, (rest as any).style]}>
        <Text style={{ color: '#fff' }}>{children ?? title}</Text>
      </Pressable>
    );
  }
};

export default Button;
