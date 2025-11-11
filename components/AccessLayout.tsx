import { Link, LinkProps } from 'expo-router';
import { memo, ReactNode, useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Components
import { Text } from './ui';

type AccessLayoutProps = {
  loading?: boolean;
  mode: 'login' | 'signup';
  children: ReactNode;
};

export const AccessLayout = memo(
  ({ loading = false, mode = 'login', children }: AccessLayoutProps) => {
    const { rt } = useUnistyles();
    const isLogin = mode === 'login';

    const content = useMemo(
      () => ({
        title: isLogin ? 'Hello' : undefined,
        titleAccent: isLogin ? 'Again!' : 'Hello!',
        subtitle: isLogin
          ? "Welcome back you've been missed"
          : 'Signup to get Started',
        footerText: isLogin
          ? "don't have an account ?"
          : 'Already have an account ?',
        footerLinkText: isLogin ? 'Sign up' : 'Login',
        footerLinkHref: isLogin ? '/signup' : '/login',
      }),
      [isLogin],
    );

    return (
      <SafeAreaView style={styles.container} key={rt.themeName}>
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            {content.title && (
              <Text variant="h1" style={styles.title}>
                {content.title}
              </Text>
            )}
            <Text variant="h1" color="accent" style={styles.titleAccent}>
              {content.titleAccent}
            </Text>
          </View>
          <Text variant="body" color="secondary" style={styles.subtitle}>
            {content.subtitle}
          </Text>

          {/* Form Fields */}
          <View style={styles.form}>
            {children}

            {/* Switch Mode */}
            <View style={styles.footer}>
              <Text variant="bodySm" color="secondary">
                {content.footerText}
              </Text>
              <Link href={content.footerLinkHref as LinkProps['href']} asChild>
                <Pressable
                  disabled={loading}
                  accessibilityRole="link"
                  accessibilityLabel={content.footerLinkText}
                  accessibilityHint={`Navigates to the ${content.footerLinkText} screen`}
                >
                  <Text variant="bodySm" color="link">
                    {content.footerLinkText}
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  },
);

AccessLayout.displayName = 'AccessLayout';

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: theme.spacing.xl,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'baseline',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  title: {
    color: theme.colors.textPrimary,
  },
  titleAccent: {
    color: theme.colors.primary,
  },
  subtitle: {
    marginBottom: theme.spacing['2xl'],
    maxWidth: 220,
  },
  form: {
    gap: theme.spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
  },
}));
