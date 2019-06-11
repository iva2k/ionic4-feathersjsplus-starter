import { User } from './user';

export class Todo {
  _id: string;
  title: string;
  notes: string;
  user?: User;
  createdAt: string;
}
