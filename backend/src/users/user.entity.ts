import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Task } from '../tasks/task.entity';

export enum UserAvailability {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  passwordHash!: string;

  @Column()
  fullName!: string;

  @Column({ type: 'enum', enum: UserAvailability, default: UserAvailability.AVAILABLE })
  availability!: UserAvailability;

  @OneToMany(() => Task, (task) => task.assignee)
  assignedTasks!: Task[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
