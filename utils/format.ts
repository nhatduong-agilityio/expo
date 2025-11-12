/**
 * Formats a given number into a string with thousands or millions suffixes.
 * @example
 * formatNumber(12345) // "12.3K"
 * formatNumber(1234567) // "1.2M"
 * @param num - the number to format
 * @returns the formatted string
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Returns a string describing the time elapsed since the given date string.
 * The string is formatted as follows:
 * - if the time elapsed is less than 1 minute, it returns the number of seconds followed by 's ago'
 * - if the time elapsed is less than 1 hour, it returns the number of minutes followed by 'm ago'
 * - if the time elapsed is less than 1 day, it returns the number of hours followed by 'h ago'
 * - if the time elapsed is less than 1 week, it returns the number of days followed by 'd ago'
 * - if the time elapsed is less than 1 month, it returns the number of weeks followed by 'w ago'
 * - otherwise, it returns the number of months followed by 'mo ago'
 * @param dateString - the date string to parse
 * @returns a string describing the time elapsed since the given date string
 */
export const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

/**
 * Recursively converts a given data structure from snake_case to camelCase.
 * Works on arrays and objects, leaving other types unchanged.
 *
 * @example
 * snakeToCamel({ foo_bar: 'baz' }) // { fooBar: 'baz' }
 * snakeToCamel([{ foo_bar: 'baz' }]) // [{ fooBar: 'baz' }]
 * snakeToCamel('foo_bar') // 'fooBar'
 *
 * @param {any} data - The data structure to convert.
 * @returns {any} The converted data structure.
 */
export const snakeToCamel = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(item => snakeToCamel(item));
  }

  if (data !== null && typeof data === 'object') {
    return Object.keys(data).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
      acc[camelKey] = snakeToCamel(data[key]);
      return acc;
    }, {} as any);
  }

  return data;
};
