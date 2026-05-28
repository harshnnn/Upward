declare module 'react-native' {
  import type { JSX, PropsWithChildren } from 'react';

  export type StyleProp<T = unknown> = T | T[] | null | undefined;

  export interface ViewProps {
    style?: StyleProp;
    [key: string]: unknown;
  }

  export interface TextProps {
    style?: StyleProp;
    children?: unknown;
    [key: string]: unknown;
  }

  export interface PressableProps extends ViewProps {
    onPress?: () => void;
  }

  export interface TextInputProps extends ViewProps {
    value?: string;
    onChangeText?: (value: string) => void;
    placeholder?: string;
    placeholderTextColor?: string;
    secureTextEntry?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  }

  export const View: (props: PropsWithChildren<ViewProps>) => JSX.Element;
  export const Text: (props: PropsWithChildren<TextProps>) => JSX.Element;
  export const Pressable: (props: PropsWithChildren<PressableProps>) => JSX.Element;
  export const TextInput: (props: TextInputProps) => JSX.Element;
}