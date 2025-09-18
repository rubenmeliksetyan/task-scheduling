import axios from 'axios';

const instance = axios.create({});

function setToken(token: string) {
  if (token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete instance.defaults.headers.common['Authorization'];
}

export default Object.assign(instance, { setToken });

