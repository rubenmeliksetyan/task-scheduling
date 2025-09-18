<template>
  <div class="card" style="position:fixed; right:16px; bottom:16px; width:320px; max-height:50vh; overflow:auto;">
    <div class="toolbar" style="position:sticky; top:0; background:var(--panel)">
      <strong>Notifications</strong>
      <div class="space"></div>
      <button class="btn" @click="clear">Clear</button>
    </div>
    <div class="stack" style="margin-top:8px">
      <div v-for="(n, idx) in notices" :key="idx" class="toolbar" style="border-bottom:1px solid #20304a; padding:6px 0">
        <span class="pill" :class="n.type==='created' ? 'status-in_progress' : 'status-done'">{{ n.type }}</span>
        <span>{{ n.message }}</span>
        <div class="space"></div>
        <small style="color:var(--muted)">{{ new Date(n.at).toLocaleTimeString() }}</small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useNotificationsStore } from '../stores/notifications';

const n = useNotificationsStore();
const { list: notices } = storeToRefs(n);
const { clear } = n;
</script>

<style scoped></style>

