<template>
  <div class="stack">
    <div class="toolbar">
      <h4 style="margin:0">Users</h4>
      <div class="space"></div>
      <span class="pill">{{ users.length }}</span>
    </div>
    <div class="stack">
      <div v-for="u in users" :key="u.id" class="toolbar" style="border-bottom:1px solid #202a40; padding:6px 0">
        <div>
          <div><strong>{{ u.fullName }}</strong></div>
          <div style="color:var(--muted); font-size:12px">{{ u.email }}</div>
        </div>
        <div class="space"></div>
        <span class="pill" :class="{ 'status-done': u.availability==='available' }">{{ u.availability }}</span>
        <button class="btn" @click="$emit('toggle', u.id)">Toggle</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ users: any[] }>();
defineEmits<{ (e: 'toggle', id: number): void }>();
</script>

<style scoped>
h4 { color: var(--muted); }
</style>

