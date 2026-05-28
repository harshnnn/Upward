import type { PropsWithChildren } from 'react';
import { View, type ViewProps } from 'react-native';

import { spacing } from '@upward/design-tokens';

export type StackProps = PropsWithChildren<Omit<ViewProps, 'gap'>> & {
  gap?: keyof typeof spacing;
  direction?: 'column' | 'row';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
};

const Stack = ({ children, gap = 4, direction = 'column', align = 'stretch', justify = 'start', style, ...props }: StackProps) => {
  const alignItems = align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : align;
  const justifyContent = justify === 'start' ? 'flex-start' : justify === 'end' ? 'flex-end' : justify === 'between' ? 'space-between' : 'center';

  return (
    <View
      {...props}
      style={[
        {
          flexDirection: direction,
          alignItems,
          justifyContent,
          gap: spacing[gap]
        },
        style as object
      ]}
    >
      {children}
    </View>
  );
};

export default Stack;