import type { PropsWithChildren } from 'react';
import { View, type ViewProps } from 'react-native';

import { spacing } from '@upward/design-tokens';

export type ContainerProps = PropsWithChildren<ViewProps> & {
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

const Container = ({ children, style, ...props }: ContainerProps) => {
  return (
    <View
      {...props}
      style={[
        {
          width: '100%',
          paddingHorizontal: spacing[4]
        },
        style as object
      ]}
    >
      {children}
    </View>
  );
};

export default Container;