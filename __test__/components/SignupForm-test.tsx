import { SignupForm } from '@/components';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useForm } from 'react-hook-form';

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: jest.fn(() => ({
    control: {
      register: jest.fn(),
      unregister: jest.fn(),
      getFieldState: jest.fn(() => ({
        invalid: false,
        isDirty: false,
        isTouched: false,
        error: undefined,
      })),
      getFormState: jest.fn(() => ({
        isDirty: false,
        isValid: false,
        isSubmitted: false,
        errors: {},
      })),
      _formValues: {},
      _fields: {},
    },
    handleSubmit: jest.fn(cb => async e => {
      e?.preventDefault();
      await cb({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        rememberMe: false,
      });
    }),
    setValue: jest.fn(),
    formState: { errors: {}, isSubmitting: false },
    watch: jest.fn(),
  })),
  Controller: jest.fn(({ render: controllerRender, name, control }) =>
    controllerRender({
      field: {
        onChange: jest.fn(),
        onBlur: jest.fn(),
        value: control?._formValues?.[name] || '',
        name,
        ref: jest.fn(),
      },
      fieldState: control?.getFieldState(name) || {
        invalid: false,
        isDirty: false,
        isTouched: false,
        error: undefined,
      },
      formState: control?.getFormState() || { errors: {}, isSubmitting: false },
    }),
  ),
}));

describe('SignupForm', () => {
  const mockOnSubmit = jest.fn();
  const mockSetValue = jest.fn();
  const mockHandleSubmit = jest.fn(cb => () => cb());
  const mockControl = {
    register: jest.fn(),
    unregister: jest.fn(),
    getFieldState: jest.fn(() => ({
      invalid: false,
      isDirty: false,
      isTouched: false,
      error: undefined,
    })),
    getFormState: jest.fn(() => ({
      isDirty: false,
      isValid: false,
      isSubmitted: false,
      errors: {},
    })),
    _formValues: {},
    _fields: {},
  };

  beforeEach(() => {
    (useForm as jest.Mock).mockReturnValue({
      control: mockControl,
      handleSubmit: mockHandleSubmit,
      setValue: mockSetValue,
      formState: { errors: {}, isSubmitting: false },
      watch: jest.fn(),
    });
    jest.clearAllMocks();
  });

  it('should match to snapshot', async () => {
    const { toJSON } = render(
      <SignupForm onSubmit={mockOnSubmit} loading={false} />,
    );

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should render email, password, confirm password, and remember me fields', () => {
    const { getByLabelText, getByText } = render(
      <SignupForm onSubmit={mockOnSubmit} loading={false} />,
    );
    expect(getByLabelText('Email*')).toBeTruthy();
    expect(getByLabelText('Password*')).toBeTruthy();
    expect(getByLabelText('Confirm Password*')).toBeTruthy();
    expect(getByText('Remember me')).toBeTruthy();
  });

  it('should call onSubmit with valid data', async () => {
    const mockSubmitData = {
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      rememberMe: false,
    };
    (useForm as jest.Mock).mockReturnValue({
      control: {
        ...mockControl,
        _formValues: mockSubmitData,
      },
      handleSubmit: jest.fn(cb => async () => {
        await cb(mockSubmitData);
      }),
      setValue: mockSetValue,
      formState: { errors: {}, isSubmitting: false },
      watch: jest.fn(() => mockSubmitData),
    });

    const { getByLabelText, getByText } = render(
      <SignupForm onSubmit={mockOnSubmit} loading={false} />,
    );

    fireEvent.changeText(getByLabelText('Email*'), 'test@example.com');
    fireEvent.changeText(getByLabelText('Password*'), 'password123');
    fireEvent.changeText(getByLabelText('Confirm Password*'), 'password123');
    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(mockSubmitData);
    });
  });

  it('should show error messages for invalid data (e.g., password mismatch)', async () => {
    (useForm as jest.Mock).mockReturnValue({
      control: {
        ...mockControl,
        getFieldState: jest.fn(name => {
          if (name === 'email')
            return { invalid: true, error: { message: 'Invalid email' } };
          if (name === 'password')
            return { invalid: true, error: { message: 'Password too short' } };
          if (name === 'confirmPassword')
            return {
              invalid: true,
              error: { message: 'Passwords do not match' },
            };
          return { invalid: false };
        }),
        getFormState: jest.fn(() => ({
          errors: {
            email: { message: 'Invalid email' },
            password: { message: 'Password too short' },
            confirmPassword: { message: 'Passwords do not match' },
          },
          isSubmitting: false,
        })),
      },
      handleSubmit: mockHandleSubmit,
      setValue: mockSetValue,
      formState: {
        errors: {
          email: { message: 'Invalid email' },
          password: { message: 'Password too short' },
          confirmPassword: { message: 'Passwords do not match' },
        },
        isSubmitting: false,
      },
      watch: jest.fn(),
    });

    const { getByText } = render(
      <SignupForm onSubmit={mockOnSubmit} loading={false} />,
    );

    await waitFor(() => {
      expect(getByText('Invalid email')).toBeTruthy();
      expect(getByText('Password too short')).toBeTruthy();
      expect(getByText('Passwords do not match')).toBeTruthy();
    });
  });

  it('should toggle password visibility for password field', () => {
    const { getByLabelText, getAllByTestId } = render(
      <SignupForm onSubmit={mockOnSubmit} loading={false} />,
    );
    const passwordInput = getByLabelText('Password*');
    expect(passwordInput.props.secureTextEntry).toBe(true);

    fireEvent.press(getAllByTestId('eye-off-outline')[0]);
    expect(passwordInput.props.secureTextEntry).toBe(false);

    fireEvent.press(getAllByTestId('eye-outline')[0]);
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it('should toggle password visibility for confirm password field', () => {
    const { getByLabelText, getAllByTestId } = render(
      <SignupForm onSubmit={mockOnSubmit} loading={false} />,
    );
    const confirmPasswordInput = getByLabelText('Confirm Password*');
    expect(confirmPasswordInput.props.secureTextEntry).toBe(true);

    // Find the second 'Press to eye off outline' which corresponds to confirm password
    fireEvent.press(getAllByTestId('eye-off-outline')[0]);
    expect(confirmPasswordInput.props.secureTextEntry).toBe(true);

    fireEvent.press(getAllByTestId('eye-outline')[0]);
    expect(confirmPasswordInput.props.secureTextEntry).toBe(true);
  });

  it('should show loading state on button', () => {
    (useForm as jest.Mock).mockReturnValue({
      control: mockControl,
      handleSubmit: mockHandleSubmit,
      setValue: mockSetValue,
      formState: { errors: {}, isSubmitting: true },
      watch: jest.fn(),
    });
    const { getByTestId } = render(
      <SignupForm onSubmit={mockOnSubmit} loading={false} />,
    );

    expect(getByTestId('loading')).toBeTruthy();
  });
});
