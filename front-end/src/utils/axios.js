import axios from 'axios';
import Cookies from 'js-cookie';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.withCredentials = true;
axios.defaults.headers['Accept'] = 'application/json';
axios.defaults.headers['Authorization'] = `Bearer ${Cookies.get('token')}`;

export default axios;
