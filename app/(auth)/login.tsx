// Components
import { AccessLayout, LoginForm } from '@/components';

const LoginScreen = () => {
  return (
    <AccessLayout mode="login">
      <LoginForm
        onSubmit={data => {
          // data is typed as LoginFormData
          console.log(data.email, data.password);
        }}
      />
    </AccessLayout>
  );
};

export default LoginScreen;
