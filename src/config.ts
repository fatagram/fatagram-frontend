const appConfig = {
  apiUrl: import.meta.env.VITE_API_URL as string,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
  googleRedirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI as string,
};

export default appConfig;
