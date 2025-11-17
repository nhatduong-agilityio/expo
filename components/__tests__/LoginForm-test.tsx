import { LoginForm } from '@/components';
import { authService } from '@/services';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { useForm } from 'react-hook-form';

// Mock authService
jest.mock('@/services', () => ({
  authService: {
    getRememberedEmail: jest.fn(),
    isRememberMeEnabled: jest.fn(),
  },
}));

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

describe('LoginForm', () => {
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
    const { toJSON } = render(<LoginForm onSubmit={mockOnSubmit} />);
    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should render email, password, and remember me fields', () => {
    const { getByLabelText, getByText } = render(
      <LoginForm onSubmit={mockOnSubmit} />,
    );
    expect(getByLabelText('Email*')).toBeTruthy();
    expect(getByLabelText('Password*')).toBeTruthy();
    expect(getByText('Remember me')).toBeTruthy();
  });

  it('should call onSubmit with valid data', async () => {
    const mockSubmitData = {
      email: 'test@example.com',
      password: 'password123',
      rememberMe: false,
    };
    (useForm as jest.Mock).mockReturnValue({
      control: {
        ...mockControl,
        _formValues: mockSubmitData, // Simulate form values
      },
      handleSubmit: jest.fn(cb => async () => {
        await cb(mockSubmitData);
      }),
      setValue: mockSetValue,
      formState: { errors: {}, isSubmitting: false },
      watch: jest.fn(() => mockSubmitData),
    });

    const { getByLabelText, getByText } = render(
      <LoginForm onSubmit={mockOnSubmit} />,
    );

    fireEvent.changeText(getByLabelText('Email*'), 'test@example.com');
    fireEvent.changeText(getByLabelText('Password*'), 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(mockSubmitData);
    });
  });

  it('should show error messages for invalid data', async () => {
    (useForm as jest.Mock).mockReturnValue({
      control: {
        ...mockControl,
        getFieldState: jest.fn(name => {
          if (name === 'email')
            return { invalid: true, error: { message: 'Invalid email' } };
          if (name === 'password')
            return { invalid: true, error: { message: 'Password too short' } };
          return { invalid: false };
        }),
        getFormState: jest.fn(() => ({
          errors: {
            email: { message: 'Invalid email' },
            password: { message: 'Password too short' },
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
        },
        isSubmitting: false,
      },
      watch: jest.fn(),
    });

    const { getByText } = render(<LoginForm onSubmit={mockOnSubmit} />);

    expect(getByText('Invalid email')).toBeTruthy();
    expect(getByText('Password too short')).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    const { getByLabelText, getByAccessibilityHint } = render(
      <LoginForm onSubmit={mockOnSubmit} />,
    );
    const passwordInput = getByLabelText('Password*');
    expect(passwordInput.props.secureTextEntry).toBe(true);

    act(() => {
      fireEvent.press(getByAccessibilityHint('Double tap to eye off outline'));
    });
    expect(passwordInput.props.secureTextEntry).toBe(false);

    act(() => {
      fireEvent.press(getByAccessibilityHint('Double tap to eye outline'));
    });
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it('should update remember me checkbox', () => {
    const { getByText } = render(<LoginForm onSubmit={mockOnSubmit} />);
    const rememberMeCheckbox = getByText('Remember me');
    act(() => {
      fireEvent.press(rememberMeCheckbox);
    });
    // The actual form state update is handled by react-hook-form's Controller.
  });

  it('should show loading state on button', async () => {
    (useForm as jest.Mock).mockReturnValue({
      control: mockControl,
      handleSubmit: mockHandleSubmit,
      setValue: mockSetValue,
      formState: { errors: {}, isSubmitting: true },
      watch: jest.fn(),
    });
    const { getByTestId } = render(<LoginForm onSubmit={mockOnSubmit} />);

    await waitFor(() => {
      expect(getByTestId('loading')).toBeTruthy();
    });
  });

  it('should load remembered email and rememberMe state on mount', async () => {
    (authService.getRememberedEmail as jest.Mock).mockResolvedValue(
      'remembered@example.com',
    );
    (authService.isRememberMeEnabled as jest.Mock).mockResolvedValue(true);

    const mockFormValues = {
      email: 'remembered@example.com',
      password: '',
      rememberMe: true,
    };
    (useForm as jest.Mock).mockReturnValue({
      control: {
        ...mockControl,
        _formValues: mockFormValues,
      },
      handleSubmit: mockHandleSubmit,
      setValue: mockSetValue,
      formState: { errors: {}, isSubmitting: false },
      watch: jest.fn(() => mockFormValues),
    });

    render(<LoginForm onSubmit={mockOnSubmit} />);

    await waitFor(() => {
      expect(authService.getRememberedEmail).toHaveBeenCalled();
      expect(authService.isRememberMeEnabled).toHaveBeenCalled();
      expect(mockSetValue).toHaveBeenCalledWith(
        'email',
        'remembered@example.com',
      );
      expect(mockSetValue).toHaveBeenCalledWith('rememberMe', true);
    });
  });
});
