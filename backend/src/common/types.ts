export type UserAvailability = 'available' | 'unavailable';

export type UserPublic = {
  id: number;
  email: string;
  fullName: string;
  availability: UserAvailability;
};

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type TaskPublic = {
  id: number;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  status: TaskStatus;
  assignee?: Pick<UserPublic, 'id' | 'email' | 'fullName'> | null;
  createdAt: Date;
  updatedAt: Date;
};

export type JwtPayload = { sub: number; email: string; name: string };
export type AuthUser = { userId: number; email: string; name: string };

