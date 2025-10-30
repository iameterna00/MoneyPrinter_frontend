
export const webApi = window.location.hostname === "localhost"
  ? 'http://127.0.0.1:8000/api' 
  : 'https://targets-modifications-masters-items.trycloudflare.com/api'; 
