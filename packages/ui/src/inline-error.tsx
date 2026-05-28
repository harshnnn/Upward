import { colors } from '@upward/design-tokens';

const InlineError = ({ message }: { message?: string }) => {
  if (!message) {
    return null;
  }

  return <p style={{ color: colors.semantic.error, marginTop: 8 }}>{message}</p>;
};

export default InlineError;
