import type { PropsWithChildren } from 'react';
import { View, type ViewProps } from 'react-native';

import { colors, radius, spacing } from '@upward/design-tokens';

export type CardProps = PropsWithChildren<ViewProps> & {
  glass?: boolean;
};

const Card = ({ children, glass = false, style, ...props }: CardProps) => {
  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: glass ? 'rgba(17, 24, 39, 0.72)' : colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: radius.lg,
          padding: spacing[5],
          shadowColor: '#000',
          shadowOpacity: 0.28,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 6 },
          elevation: 4
        },
        style as object
      ]}
    >
      {children}
    </View>
  );
};

export default Card;