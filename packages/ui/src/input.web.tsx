import type { InputHTMLAttributes } from 'react';

import { colors, radius, spacing } from '@upward/design-tokens';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = ({ style, ...props }: InputProps) => {
  return (
    <input
      {...props}
      style={{
        width: '100%',
        border: `1px solid ${colors.borderStrong}`,
        borderRadius: radius.md,
        background: colors.backgroundElevated,
        color: colors.text,
        padding: `${spacing[3]}px ${spacing[4]}px`,
        outline: 'none',
        fontSize: 15,
        boxSizing: 'border-box',
        ...style
      }}
    />
  );
};

export default Input;