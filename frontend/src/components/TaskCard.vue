<template>
  <div class="card" style="padding:12px">
    <div class="toolbar">
      <strong>{{ task.title }}</strong>
      <div class="space"></div>
      <span class="pill" :class="'status-' + task.status">{{ task.status.replace('_', ' ') }}</span>
    </div>
    <p v-if="task.description" style="margin:8px 0 0; color:var(--muted); white-space:pre-wrap">{{ task.description }}</p>
    <div class="toolbar" style="margin-top:10px">
      <small v-if="task.assignee">👤 {{ task.assignee.fullName }}</small>
      <div class="space"></div>
      <button class="btn" @click="$emit('edit', task)">Edit</button>
      <button class="btn btn-danger" @click="$emit('remove', task.id)">Delete</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '../types';
defineProps<{ task: Task }>();
defineEmits<{ (e: 'edit', task: Task): void; (e: 'remove', id: number): void }>();
</script>

<style scoped></style>
