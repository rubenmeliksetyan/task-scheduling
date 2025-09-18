export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type User = {
  id: number;
  email: string;
  fullName: string;
  availability: 'available' | 'unavailable';
};

export type Task = {
  id: number;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  status: TaskStatus;
  assignee?: Pick<User, 'id' | 'email' | 'fullName'> | null;
  createdAt?: string;
  updatedAt?: string;
};

export type TaskInput = Partial<Pick<Task, 'title' | 'description' | 'dueDate' | 'status'>> & {
  title: string;
  assigneeId?: number;
};

