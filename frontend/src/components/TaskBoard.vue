<template>
  <div class="stack">
    <div class="toolbar">
      <button class="btn btn-primary" @click="$emit('edit', null) || $emit('create')">New Task</button>
      <div class="space"></div>
      <span class="pill">{{ tasks.length }} tasks</span>
    </div>
    <div class="row">
      <div class="col">
        <h4>To do</h4>
        <div class="stack">
          <task-card v-for="t in byStatus('todo')" :key="t.id" :task="t" @edit="$emit('edit', t)" @remove="$emit('remove', t.id)" />
        </div>
      </div>
      <div class="col">
        <h4>In progress</h4>
        <div class="stack">
          <task-card v-for="t in byStatus('in_progress')" :key="t.id" :task="t" @edit="$emit('edit', t)" @remove="$emit('remove', t.id)" />
        </div>
      </div>
      <div class="col">
        <h4>Done</h4>
        <div class="stack">
          <task-card v-for="t in byStatus('done')" :key="t.id" :task="t" @edit="$emit('edit', t)" @remove="$emit('remove', t.id)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TaskCard from './TaskCard.vue';

const props = defineProps<{ tasks: any[] }>();
const emit = defineEmits<{ (e: 'edit', t: any | null): void; (e: 'remove', id: number): void; (e: 'create'): void }>();

const byStatus = (s: string) => props.tasks.filter((t) => t.status === s);
</script>

<style scoped>
h4 { margin: 0 0 8px; color: var(--muted); }
</style>

