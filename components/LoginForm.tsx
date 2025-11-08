import { zodResolver } from '@hookform/resolvers/zod';
import { memo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { z } from 'zod';

import { loginSchema } from '@/constants';
import { Button, Checkbox, Input } from './ui';

export type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = memo(
  ({
    onSubmit,
  }: {
    onSubmit: (data: LoginFormData) => void | Promise<void>;
  }) => {
    const [showPassword, setShowPassword] = useState(false);

    const {
      control,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
        email: '',
        password: '',
        rememberMe: false,
      },
    });

    const isLoading = isSubmitting;

    return (
      <View style={styles.container}>
        {/* Email Field */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email*"
              placeholder="Input text"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              disabled={isLoading}
              showClearButton
            />
          )}
        />

        {/* Password Field */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password*"
              placeholder="••••••••"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
              disabled={isLoading}
              rightIcon={showPassword ? 'eye-outline' : 'eye-off-outline'}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />
          )}
        />

        {/* Remember Me & Forgot Password */}
        <View style={styles.row}>
          <Controller
            control={control}
            name="rememberMe"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                checked={value}
                onChange={onChange}
                label="Remember me"
                disabled={isLoading}
              />
            )}
          />
        </View>

        {/* Submit Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading}
        >
          Login
        </Button>
      </View>
    );
  },
);

LoginForm.displayName = 'LoginForm';

const styles = StyleSheet.create(theme => ({
  container: {
    gap: theme.spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));
