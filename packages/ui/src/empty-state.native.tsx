import type { PropsWithChildren } from 'react';
import { Text, View, type ViewProps } from 'react-native';

import { colors, radius, spacing, typography } from '@upward/design-tokens';

export type EmptyStateProps = PropsWithChildren<ViewProps> & {
  title: string;
  description?: string;
};

const EmptyState = ({ title, description, children, style, ...props }: EmptyStateProps) => {
  return (
    <View
      {...props}
      style={[
        {
          borderWidth: 1,
          borderColor: colors.borderStrong,
          borderStyle: 'dashed',
          borderRadius: radius.lg,
          padding: spacing[6],
          alignItems: 'center'
        },
        style as object
      ]}
    >
      <Text style={{ fontSize: typography.size.lg, color: colors.text, fontWeight: '600' }}>{title}</Text>
      {description ? <Text style={{ marginTop: spacing[2], color: colors.textMuted }}>{description}</Text> : null}
      {children ? <View style={{ marginTop: spacing[4] }}>{children}</View> : null}
    </View>
  );
};

export default EmptyState;