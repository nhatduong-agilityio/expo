import { zodResolver } from '@hookform/resolvers/zod';
import { memo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { z } from 'zod';

// Constants
import { signupSchema } from '@/constants';

// Components
import { Button, Checkbox, Input } from './ui';

type SignupFormData = z.infer<typeof signupSchema>;

export const SignupForm = memo(
  ({
    onSubmit,
    loading,
  }: {
    onSubmit: (data: SignupFormData) => void | Promise<void>;
    loading: boolean;
  }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
      control,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<SignupFormData>({
      resolver: zodResolver(signupSchema),
      defaultValues: {
        email: '',
        password: '',
        confirmPassword: '',
        rememberMe: false,
      },
    });
    const isLoading = loading || isSubmitting;

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
              autoComplete="new-password"
              disabled={isLoading}
              rightIcon={showPassword ? 'eye-outline' : 'eye-off-outline'}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />
          )}
        />

        {/* Confirm Password Field */}
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Confirm Password*"
              placeholder="••••••••"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.confirmPassword?.message}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoComplete="new-password"
              disabled={isLoading}
              rightIcon={
                showConfirmPassword ? 'eye-outline' : 'eye-off-outline'
              }
              onRightIconPress={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />
          )}
        />

        {/* Remember Me */}
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
          Signup
        </Button>
      </View>
    );
  },
);

SignupForm.displayName = 'SignupForm';

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
