<template>
  <div v-if="open" style="position:fixed;inset:0;background:#0008;display:grid;place-items:center;z-index:50">
    <div class="card" style="width:100%;max-width:520px">
      <h3 style="margin:0 0 12px">{{ initial ? 'Edit task' : 'Create task' }}</h3>
      <div class="stack">
        <div class="stack">
          <label>Title</label>
          <input class="input" v-model="form.title" />
        </div>
        <div class="stack">
          <label>Description</label>
          <textarea class="textarea" rows="3" v-model="form.description"></textarea>
        </div>
        <div class="row">
          <div class="col">
            <label>Due date</label>
            <input class="input" type="date" v-model="form.dueDate" />
          </div>
          <div class="col">
            <label>Status</label>
            <select class="select" v-model="form.status">
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>
        <div class="stack">
          <label>Assignee (user id)</label>
          <input class="input" type="number" v-model.number="form.assigneeId" placeholder="e.g. 1" />
        </div>
      </div>
      <div class="toolbar" style="margin-top:16px">
        <button class="btn" @click="$emit('close')">Cancel</button>
        <div class="space"></div>
        <button class="btn btn-primary" @click="save">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { Task, TaskInput, TaskStatus } from '../types';

const props = defineProps<{ open: boolean; initial: Task | null }>();
const emit = defineEmits<{ (e: 'save', payload: TaskInput): void; (e: 'close'): void }>();

const form = reactive({ title: '', description: '', dueDate: '', status: 'todo' as TaskStatus, assigneeId: undefined as number | undefined });

watch(() => props.initial, (v) => {
  if (v) {
    form.title = v.title || '';
    form.description = v.description || '';
    form.status = v.status || 'todo';
    form.assigneeId = v.assignee?.id;
    form.dueDate = v.dueDate ? v.dueDate.substring(0, 10) : '';
  } else {
    form.title = '';
    form.description = '';
    form.status = 'todo';
    form.assigneeId = undefined;
    form.dueDate = '';
  }
}, { immediate: true });

function save() {
  const payload: TaskInput = { title: form.title, description: form.description, status: form.status };
  if (form.assigneeId) payload.assigneeId = form.assigneeId;
  if (form.dueDate) payload.dueDate = form.dueDate;
  emit('save', payload);
}
</script>

<style scoped>
label { color: var(--muted); font-size: 14px; }
</style>
