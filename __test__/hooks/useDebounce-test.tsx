import { useDebounce } from '@/hooks/useDebounce';
import { act, renderHook } from '@testing-library/react-native';

jest.useFakeTimers();

describe('useDebounce', () => {
  it('should return the initial value', () => {
    const { result } = renderHook(() => useDebounce('test'));
    expect(result.current).toBe('test');
  });

  it('should update the value after the specified delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      {
        initialProps: { value: 'test', delay: 500 },
      },
    );

    expect(result.current).toBe('test');

    rerender({ value: 'updated', delay: 500 });

    expect(result.current).toBe('test');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });

  it('should handle rapid changes and only update to the latest value', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      },
    );

    rerender({ value: 'change 1', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    rerender({ value: 'change 2', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    rerender({ value: 'final', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('final');
  });
});
