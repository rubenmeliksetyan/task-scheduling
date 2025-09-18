<template>
  <div class="toolbar" style="margin-bottom:12px">
    <input class="input" style="flex:2" placeholder="Search title/description" v-model="modelQ" />
    <select class="select" v-model="modelStatus">
      <option value="">All statuses</option>
      <option value="todo">To do</option>
      <option value="in_progress">In progress</option>
      <option value="done">Done</option>
    </select>
    <input class="input" type="number" style="width:140px" placeholder="Assignee id" v-model.number="modelAssigneeId" />
    <button class="btn" @click="$emit('refresh')">Refresh</button>
    <button class="btn btn-primary" @click="$emit('create')">New</button>
  </div>
</template>

<script setup lang="ts">
const modelQ = defineModel<string>('q', { default: '' });
const modelStatus = defineModel<string>('status', { default: '' });
const modelAssigneeId = defineModel<number | ''>('assigneeId', { default: '' });
defineEmits<{ (e: 'create'): void; (e: 'refresh'): void }>();
</script>

<style scoped></style>

