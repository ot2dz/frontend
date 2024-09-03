import axios from 'axios';

const API = axios.create({
  baseURL: 'https://backendtaxi.netlify.app/api' // تأكد من أن هذا هو URL الصحيح للواجهة الخلفية
});

export default API;
