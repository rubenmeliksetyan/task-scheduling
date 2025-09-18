<template>
  <div class="container">
    <div class="toolbar">
      <h2 style="margin:0">Task Scheduler</h2>
      <div class="space"></div>
      <button class="btn" @click="logout">Logout</button>
    </div>

    <div class="row" style="margin-top:16px">
      <div class="col">
        <div class="card">
          <task-filters @create="openCreate" @refresh="refresh" v-model:q="q" v-model:status="statusFilter" v-model:assigneeId="assigneeFilter" />
          <task-board :tasks="tasks" @edit="openEdit" @remove="removeTask" />
        </div>
      </div>
      <div class="col" style="max-width:360px">
        <div class="card">
          <user-availability :users="users" @toggle="toggleAvailability" />
        </div>
      </div>
    </div>

    <task-modal :open="modalOpen" :initial="editing" @close="closeModal" @save="saveTask" />
    <notification-tray />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import api from '../utils/api';
import type { Task, User } from '../types';
import { useAuthStore } from '../stores/auth';
import TaskBoard from '../components/TaskBoard.vue';
import TaskModal from '../components/TaskModal.vue';
import UserAvailability from '../components/UserAvailability.vue';
import TaskFilters from '../components/TaskFilters.vue';
import NotificationTray from '../components/NotificationTray.vue';
import { connectRealtime } from '../utils/realtime';
import { useNotificationsStore } from '../stores/notifications';

const auth = useAuthStore();
api.setToken(auth.token);

const tasks = ref<Task[]>([]);
const users = ref<User[]>([]);
const modalOpen = ref(false);
const editing = ref<Task | null>(null);
const q = ref('');
const statusFilter = ref('');
const assigneeFilter = ref<number | ''>('');
const notifications = useNotificationsStore();

function logout() {
  auth.logout();
  location.href = '/login';
}

async function loadTasks() {
  const params: any = {};
  if (q.value) params.q = q.value;
  if (statusFilter.value) params.status = statusFilter.value;
  if (assigneeFilter.value) params.assigneeId = assigneeFilter.value;
  const { data } = await api.get('/api/tasks', { params });
  tasks.value = data;
}

async function loadUsers() {
  const { data } = await api.get('/api/users');
  users.value = data;
}

async function refresh() {
  await Promise.all([loadTasks(), loadUsers()]);
}

function openCreate() {
  editing.value = null;
  modalOpen.value = true;
}

function openEdit(task: Task) {
  editing.value = task;
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
}

async function saveTask(payload: any) {
  if (editing.value) {
    await api.patch(`/api/tasks/${editing.value.id}`, payload);
  } else {
    await api.post('/api/tasks', payload);
  }
  modalOpen.value = false;
  await loadTasks();
}

async function removeTask(id: number) {
  await api.delete(`/api/tasks/${id}`);
  await loadTasks();
}

async function toggleAvailability(id: number) {
  await api.patch(`/api/users/${id}/toggle-availability`);
  await loadUsers();
}

onMounted(refresh);
watch([q, statusFilter, assigneeFilter], loadTasks);

// realtime
onMounted(() => {
  const s = connectRealtime();
  s.on('connect', () => {
    // console.log('Realtime connected');
  });
  s.on('task.created', (t: any) => {
    notifications.push({ type: 'created', message: `Task created: ${t.title}`, at: Date.now() });
    loadTasks();
  });
  s.on('task.updated', (t: any) => {
    notifications.push({ type: 'updated', message: `Task updated: ${t.title}`, at: Date.now() });
    loadTasks();
  });
});
</script>

<style scoped>
h2 { margin: 0; }
</style>
