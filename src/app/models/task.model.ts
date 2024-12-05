export interface Task {
  id?: number;
  entityName: string;
  taskType: string;
  date: Date | string;
  taskTime: Date | string;
  contactPerson: string;
  note?: string;
  status: 'open' | 'closed';
} 