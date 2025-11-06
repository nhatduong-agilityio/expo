import { memo } from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { StyleSheet, UnistylesVariants } from 'react-native-unistyles';

type TextVariants = UnistylesVariants<typeof styles>;

export type TextProps = RNTextProps & {
  variant?: TextVariants['variant'];
  color?: TextVariants['color'];
  align?: TextVariants['align'];
  textTransform?: TextVariants['textTransform'];
  decoration?: TextVariants['decoration'];
};

export const Text = memo(
  ({
    variant = 'body',
    color,
    align,
    textTransform,
    decoration,
    ...rest
  }: TextProps) => {
    styles.useVariants({
      variant,
      color,
      align,
      textTransform,
      decoration,
    });

    return <RNText style={styles.container} {...rest} />;
  },
);

Text.displayName = 'Text';

const styles = StyleSheet.create(theme => ({
  container: {
    variants: {
      variant: {
        display: {
          fontSize: theme.fontSize['4xl'],
          lineHeight: theme.lineHeight['4xl'],
          fontFamily: theme.fontFamily.bold,
          fontWeight: theme.fontWeight.bold,
          color: theme.colors.textPrimary,
        },
        h1: {
          fontSize: theme.fontSize['3xl'],
          lineHeight: theme.lineHeight['3xl'],
          fontFamily: theme.fontFamily.bold,
          fontWeight: theme.fontWeight.bold,
          color: theme.colors.textPrimary,
        },
        h2: {
          fontSize: theme.fontSize['2xl'],
          lineHeight: theme.lineHeight['2xl'],
          fontFamily: theme.fontFamily.bold,
          fontWeight: theme.fontWeight.bold,
          color: theme.colors.textPrimary,
        },
        h3: {
          fontSize: theme.fontSize.xl,
          lineHeight: theme.lineHeight.xl,
          fontFamily: theme.fontFamily.semiBold,
          fontWeight: theme.fontWeight.semiBold,
          color: theme.colors.textPrimary,
        },
        h4: {
          fontSize: theme.fontSize.lg,
          lineHeight: theme.lineHeight.lg,
          fontFamily: theme.fontFamily.semiBold,
          fontWeight: theme.fontWeight.semiBold,
          color: theme.colors.textPrimary,
        },
        body: {
          fontSize: theme.fontSize.md,
          lineHeight: theme.lineHeight.md,
          fontFamily: theme.fontFamily.regular,
          fontWeight: theme.fontWeight.regular,
          color: theme.colors.textPrimary,
        },
        bodyLg: {
          fontSize: theme.fontSize.lg,
          lineHeight: theme.lineHeight.lg,
          fontFamily: theme.fontFamily.regular,
          fontWeight: theme.fontWeight.regular,
          color: theme.colors.textPrimary,
        },
        bodySm: {
          fontSize: theme.fontSize.sm,
          lineHeight: theme.lineHeight.sm,
          fontFamily: theme.fontFamily.regular,
          fontWeight: theme.fontWeight.regular,
          color: theme.colors.textPrimary,
        },
        caption: {
          fontSize: theme.fontSize.xs,
          lineHeight: theme.lineHeight.xs,
          fontFamily: theme.fontFamily.regular,
          fontWeight: theme.fontWeight.regular,
          color: theme.colors.textSecondary,
        },
        label: {
          fontSize: theme.fontSize.sm,
          lineHeight: theme.lineHeight.sm,
          fontFamily: theme.fontFamily.semiBold,
          fontWeight: theme.fontWeight.semiBold,
          color: theme.colors.textPrimary,
        },
        button: {
          fontSize: theme.fontSize.md,
          lineHeight: theme.lineHeight.md,
          fontFamily: theme.fontFamily.semiBold,
          fontWeight: theme.fontWeight.semiBold,
          letterSpacing: 0.12,
          color: theme.colors.textPrimary,
        },
        placeholder: {
          fontSize: theme.fontSize.md,
          lineHeight: theme.lineHeight.md,
          fontFamily: theme.fontFamily.regular,
          fontWeight: theme.fontWeight.regular,
          color: theme.colors.textPlaceholder,
        },
      },
      color: {
        primary: {
          color: theme.colors.textPrimary,
        },
        secondary: {
          color: theme.colors.textSecondary,
        },
        tertiary: {
          color: theme.colors.textTertiary,
        },
        disabled: {
          color: theme.colors.textDisabled,
        },
        placeholder: {
          color: theme.colors.textPlaceholder,
        },
        onPrimary: {
          color: theme.colors.textOnPrimary,
        },
        link: {
          color: theme.colors.textLink,
        },
        accent: {
          color: theme.colors.primary,
        },
        error: {
          color: theme.colors.error,
        },
        errorHover: {
          color: theme.colors.errorHover,
        },
        success: {
          color: theme.colors.success,
        },
        successHover: {
          color: theme.colors.successHover,
        },
        warning: {
          color: theme.colors.warning,
        },
        warningHover: {
          color: theme.colors.warningHover,
        },
      },
      align: {
        left: {
          textAlign: 'left',
        },
        center: {
          textAlign: 'center',
        },
        right: {
          textAlign: 'right',
        },
        justify: {
          textAlign: 'justify',
        },
      },
      textTransform: {
        none: {
          textTransform: 'none',
        },
        uppercase: {
          textTransform: 'uppercase',
        },
        lowercase: {
          textTransform: 'lowercase',
        },
        capitalize: {
          textTransform: 'capitalize',
        },
      },
      decoration: {
        none: {
          textDecorationLine: 'none',
        },
        underline: {
          textDecorationLine: 'underline',
        },
        lineThrough: {
          textDecorationLine: 'line-through',
        },
        underlineLineThrough: {
          textDecorationLine: 'underline line-through',
        },
      },
    },
  },
}));
