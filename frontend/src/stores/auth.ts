import { defineStore } from 'pinia';
import api from '../utils/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: (localStorage.getItem('token') || '') as string,
    loading: false as boolean,
    error: '' as string,
  }),
  getters: {
    isAuthenticated: (s) => !!s.token,
  },
  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.error = '';
      try {
        const { data } = await api.post('/api/auth/login', { email, password });
        this.token = data.access_token;
        localStorage.setItem('token', this.token);
        api.setToken(this.token);
      } catch (e: any) {
        this.error = e?.response?.data?.message || 'Login failed';
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.token = '';
      localStorage.removeItem('token');
      api.setToken('');
    },
  },
});

