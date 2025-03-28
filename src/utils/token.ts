
// This snippet is responsible for getting, setting, and removing the access token and refresh token from local storage.
// export const getAccessToken = (): string | null => localStorage.getItem('accessToken');

// export const getAccessTokenFromSession = (): string | null => sessionStorage.getItem('accessToken');

export const getRefreshToken = (): string | null => localStorage.getItem('refreshToken');

export const getRefreshTokenFromSession = (): string | null => sessionStorage.getItem('refreshToken');

// export const setAccessToken = (accessToken: string): void => localStorage.setItem('accessToken', accessToken);

// export const setAccessTokenToSession = (accessToken: string): void => sessionStorage.setItem('accessToken', accessToken);

export const setRefreshToken = (refreshToken: string): void => localStorage.setItem('refreshToken', refreshToken);

export const setRefreshTokenToSession = (refreshToken: string): void => sessionStorage.setItem('refreshToken', refreshToken);

// export const removeAccessToken = (): void => localStorage.removeItem('accessToken');

// export const removeAccessTokenFromSession = (): void => sessionStorage.removeItem('accessToken');

export const removeRefreshToken = (): void => localStorage.removeItem('refreshToken');

export const removeRefreshTokenFromSession = (): void => sessionStorage.removeItem('refreshToken');
