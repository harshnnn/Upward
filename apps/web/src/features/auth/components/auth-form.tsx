import type { FormEvent, PropsWithChildren, ReactNode } from 'react';

import AuthButton from '@upward/ui/auth-button';
import AuthInput from '@upward/ui/auth-input';
import InlineError from '@upward/ui/inline-error';
import PageShell from '@upward/ui/page-shell';

export type AuthFormProps = PropsWithChildren<{
  title: string;
  subtitle: string;
  submitLabel: string;
  error?: string | null;
  loading?: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  footer?: ReactNode;
}>;

export const AuthForm = ({
  title,
  subtitle,
  submitLabel,
  error,
  loading,
  onSubmit,
  children,
  footer
}: AuthFormProps) => {
  return (
    <PageShell>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 16, marginTop: 40 }}>
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 8 }}>{title}</h1>
          <p style={{ color: '#6b7280' }}>{subtitle}</p>
        </div>
        {children}
        <AuthButton type="submit" disabled={loading}>
          {loading ? 'Please wait...' : submitLabel}
        </AuthButton>
        <InlineError message={error ?? undefined} />
        {footer}
      </form>
    </PageShell>
  );
};

export const AuthField = AuthInput;
