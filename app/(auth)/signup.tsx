// Components
import { AccessLayout, SignupForm } from '@/components';

const SignupScreen = () => {
  return (
    <AccessLayout mode="signup">
      <SignupForm
        onSubmit={data => {
          // data is typed as LoginFormData
          console.log(data.email, data.password);
        }}
        loading={false}
      />
    </AccessLayout>
  );
};

export default SignupScreen;
