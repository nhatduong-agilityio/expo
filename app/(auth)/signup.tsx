// Types
import { SignUpData } from '@/types';

// Hooks
import { useAuth } from '@/hooks';

// Components
import { AccessLayout, SignupForm } from '@/components';

const SignupScreen = () => {
  const { signUp, isSigningUp } = useAuth();

  const handleSubmit = (data: SignUpData) => {
    signUp(data);
  };

  return (
    <AccessLayout mode="signup" loading={isSigningUp}>
      <SignupForm onSubmit={handleSubmit} loading={isSigningUp} />
    </AccessLayout>
  );
};

export default SignupScreen;
