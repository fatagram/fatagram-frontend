export const url: { http: string; https: string; iis: string } = {
    http: process.env.REACT_APP_HTTP_URL || '',
    https: process.env.REACT_APP_HTTPS_URL || '',
    iis: process.env.REACT_APP_IIS_URL || '',
  };
const apiUrl = url.http;
export default apiUrl