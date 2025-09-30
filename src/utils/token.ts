export const getRefreshToken = (): string | null => localStorage.getItem("refreshToken");

export const getRefreshTokenFromSession = (): string | null =>
  sessionStorage.getItem("refreshToken");

export const setRefreshToken = (refreshToken: string): void =>
  localStorage.setItem("refreshToken", refreshToken);

export const setRefreshTokenToSession = (refreshToken: string): void =>
  sessionStorage.setItem("refreshToken", refreshToken);

export const removeRefreshToken = (): void => localStorage.removeItem("refreshToken");

export const removeRefreshTokenFromSession = (): void => sessionStorage.removeItem("refreshToken");
