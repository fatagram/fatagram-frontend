// Get, set, remove access token and refresh token from local storage
// This snippet is responsible for getting, setting, and removing the access token and refresh token from local storage.
export const getAccessToken = (): string | null => localStorage.getItem('accessToken');

export const getRefreshToken = (): string | null => localStorage.getItem('refreshToken');

export const setAccessToken = (accessToken: string): void => localStorage.setItem('accessToken', accessToken);

export const setRefreshToken = (refreshToken: string): void => localStorage.setItem('refreshToken', refreshToken);

export const removeAccessToken = (): void => localStorage.removeItem('accessToken');

export const removeRefreshToken = (): void => localStorage.removeItem('refreshToken');