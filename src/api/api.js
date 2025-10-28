
export const webApi = window.location.hostname === "localhost"
  ? 'http://127.0.0.1:8000/api' 
  : 'https://viking-visits-constitutes-handhelds.trycloudflare.com/api'; 
