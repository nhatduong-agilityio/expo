import { formatNumber, getTimeAgo, snakeToCamel } from '@/utils';

describe('formatNumber', () => {
  it('should format numbers less than 1000 as is', () => {
    expect(formatNumber(999)).toBe('999');
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(500)).toBe('500');
  });

  it('should format thousands with K suffix', () => {
    expect(formatNumber(1000)).toBe('1.0K');
    expect(formatNumber(1500)).toBe('1.5K');
    expect(formatNumber(12345)).toBe('12.3K');
  });

  it('should format millions with M suffix', () => {
    expect(formatNumber(1000000)).toBe('1.0M');
    expect(formatNumber(1500000)).toBe('1.5M');
    expect(formatNumber(12345678)).toBe('12.3M');
  });
});

describe('getTimeAgo', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return seconds ago for recent times', () => {
    const date = new Date('2024-01-01T11:59:30Z').toISOString();
    expect(getTimeAgo(date)).toBe('30s ago');
  });

  it('should return minutes ago', () => {
    const date = new Date('2024-01-01T11:55:00Z').toISOString();
    expect(getTimeAgo(date)).toBe('5m ago');
  });

  it('should return hours ago', () => {
    const date = new Date('2024-01-01T10:00:00Z').toISOString();
    expect(getTimeAgo(date)).toBe('2h ago');
  });

  it('should return days ago', () => {
    const date = new Date('2023-12-30T12:00:00Z').toISOString();
    expect(getTimeAgo(date)).toBe('2d ago');
  });

  it('should return weeks ago', () => {
    const date = new Date('2023-12-18T12:00:00Z').toISOString();
    expect(getTimeAgo(date)).toBe('2w ago');
  });

  it('should return months ago', () => {
    const date = new Date('2023-11-01T12:00:00Z').toISOString();
    expect(getTimeAgo(date)).toBe('2mo ago');
  });
});

describe('snakeToCamel', () => {
  it('should convert snake_case keys to camelCase', () => {
    const input = { foo_bar: 'baz', hello_world: 'test' };
    const expected = { fooBar: 'baz', helloWorld: 'test' };
    expect(snakeToCamel(input)).toEqual(expected);
  });

  it('should handle nested objects', () => {
    const input = {
      user_name: 'John',
      user_profile: {
        first_name: 'John',
        last_name: 'Doe',
      },
    };
    const expected = {
      userName: 'John',
      userProfile: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };
    expect(snakeToCamel(input)).toEqual(expected);
  });

  it('should handle arrays', () => {
    const input = [{ user_name: 'John' }, { user_name: 'Jane' }];
    const expected = [{ userName: 'John' }, { userName: 'Jane' }];
    expect(snakeToCamel(input)).toEqual(expected);
  });

  it('should return primitives unchanged', () => {
    expect(snakeToCamel('test')).toBe('test');
    expect(snakeToCamel(123)).toBe(123);
    expect(snakeToCamel(null)).toBe(null);
  });
});
