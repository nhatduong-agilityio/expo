import { AccessLayout } from '@/components';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

describe('AccessLayout', () => {
  it('should match snapshot for login mode', () => {
    const { toJSON } = render(
      <AccessLayout mode="login">
        <Text>Login Form</Text>
      </AccessLayout>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot for signup mode', () => {
    const { toJSON } = render(
      <AccessLayout mode="signup">
        <Text>Signup Form</Text>
      </AccessLayout>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render correct titles and subtitles for login mode', () => {
    const { getByText } = render(
      <AccessLayout mode="login">
        <></>
      </AccessLayout>,
    );
    expect(getByText('Hello')).toBeTruthy();
    expect(getByText('Again!')).toBeTruthy();
    expect(getByText("Welcome back you've been missed")).toBeTruthy();
    expect(getByText("don't have an account ?")).toBeTruthy();
    expect(getByText('Sign up')).toBeTruthy();
  });

  it('should render correct titles and subtitles for signup mode', () => {
    const { getByText } = render(
      <AccessLayout mode="signup">
        <></>
      </AccessLayout>,
    );
    expect(getByText('Hello!')).toBeTruthy();
    expect(getByText('Signup to get Started')).toBeTruthy();
    expect(getByText('Already have an account ?')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });

  it('should render children components', () => {
    const { getByText } = render(
      <AccessLayout mode="login">
        <Text>Child Component</Text>
      </AccessLayout>,
    );
    expect(getByText('Child Component')).toBeTruthy();
  });

  it('should show loading overlay and message when loading', () => {
    const { getByText } = render(
      <AccessLayout mode="login" loading>
        <></>
      </AccessLayout>,
    );
    expect(getByText('Logging you in...')).toBeTruthy();
  });

  it('should show correct loading message for signup mode', () => {
    const { getByText } = render(
      <AccessLayout mode="signup" loading>
        <></>
      </AccessLayout>,
    );
    expect(getByText('Creating your account...')).toBeTruthy();
  });
});
