import { defineStore } from 'pinia';

export type Notice = { type: 'created'|'updated'; message: string; at: number };

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    list: [] as Notice[],
  }),
  actions: {
    push(n: Notice) {
      this.list.unshift(n);
      // keep last 20
      if (this.list.length > 20) this.list.pop();
    },
    clear() {
      this.list = [];
    },
  },
});

