// Types
import { SignInData } from '@/types';

// Hooks
import { useAuth } from '@/hooks';

// Components
import { AccessLayout, LoginForm } from '@/components';

const LoginScreen = () => {
  const { signIn, isSigningIn, signInError } = useAuth();

  const handleSubmit = (data: SignInData) => {
    signIn(data);
  };

  if (signInError) {
    console.error(signInError);
  }

  return (
    <AccessLayout mode="login" loading={isSigningIn}>
      <LoginForm onSubmit={handleSubmit} loading={isSigningIn} />
    </AccessLayout>
  );
};

export default LoginScreen;
