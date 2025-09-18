<template>
  <div class="container" style="display:grid;place-items:center;height:100%">
    <div class="card" style="width:100%;max-width:380px">
      <h2>Admin Login</h2>
      <div class="stack" style="margin-top:12px">
        <label>Email</label>
        <input v-model="email" class="input" placeholder="admin@example.com" />
      </div>
      <div class="stack" style="margin-top:12px">
        <label>Password</label>
        <input type="password" v-model="password" class="input" placeholder="••••••••" />
      </div>
      <div class="toolbar" style="margin-top:16px">
        <button class="btn btn-primary" :disabled="auth.loading" @click="submit">
          {{ auth.loading ? 'Signing in…' : 'Sign in' }}
        </button>
        <span class="pill" v-if="auth.error">{{ auth.error }}</span>
      </div>
    </div>
  </div>
  </template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const redirect = (route.query.redirect as string) || '/';

const auth = useAuthStore();
const email = ref('admin@example.com');
const password = ref('changeme');

watchEffect(() => {
  if (auth.isAuthenticated) router.replace(redirect);
});

async function submit() {
  await auth.login(email.value, password.value);
  if (auth.isAuthenticated) router.replace(redirect);
}
</script>

<style scoped>
h2 { margin: 0 0 8px; }
label { color: var(--muted); font-size: 14px; }
</style>

