import type { WraithTheme } from '../types/theme';

export async function fetchTheme(
  url: string
): Promise<WraithTheme> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch theme');
  }

  return response.json();
}