import { AccessLayout, SignupForm } from '@/components';

export default function SignupScreen() {
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
}
