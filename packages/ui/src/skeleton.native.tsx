import { View, type ViewProps } from 'react-native';

import { colors, radius } from '@upward/design-tokens';

const Skeleton = ({ style, ...props }: ViewProps) => {
  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: colors.surfaceMuted,
          borderRadius: radius.md
        },
        style as object
      ]}
    />
  );
};

export default Skeleton;