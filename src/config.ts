
const url: { http: string; https:string, ngrok: string, httpLocal: string, httpsLocal: string} = {
    http: 'http://192.168.137.1:5000',
    https: 'https://192.168.137.1:5001',
    ngrok: 'https://e99a-14-169-56-27.ngrok-free.app',
    httpLocal: 'http://localhost:5000',
    httpsLocal: 'https://localhost:5001',
  };
const apiUrl = url.http;

export default apiUrl