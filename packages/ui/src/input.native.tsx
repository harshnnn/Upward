import type { TextInputProps } from 'react-native';
import { TextInput } from 'react-native';

import { colors, radius, spacing } from '@upward/design-tokens';

export type InputProps = TextInputProps;

const Input = ({ style, ...props }: InputProps) => {
  return (
    <TextInput
      {...props}
      placeholderTextColor={colors.textSubtle}
      style={[
        {
          width: '100%',
          borderWidth: 1,
          borderColor: colors.borderStrong,
          borderRadius: radius.md,
          backgroundColor: colors.backgroundElevated,
          color: colors.text,
          paddingVertical: spacing[3],
          paddingHorizontal: spacing[4],
          fontSize: 15
        },
        style as object
      ]}
    />
  );
};

export default Input;