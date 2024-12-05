import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root'
})
export class MockDataService implements InMemoryDbService {
  createDb() {
    const tasks = [
      {
        id: 1,
        entityName: 'Company A',
        taskType: 'Meeting',
        date: new Date(),
        taskTime: new Date(),
        contactPerson: 'John Doe',
        note: 'Initial meeting',
        status: 'open'
      },
      {
        id: 2,
        entityName: 'Company B',
        taskType: 'Call',
        date: new Date(Date.now() + 86400000), // tomorrow
        taskTime: new Date(Date.now() + 90000000),
        contactPerson: 'Jane Smith',
        note: 'Follow-up call',
        status: 'open'
      },
      {
        id: 3,
        entityName: 'Company C',
        taskType: 'Email',
        date: new Date(Date.now() - 86400000), // yesterday
        taskTime: new Date(Date.now() - 82800000),
        contactPerson: 'Bob Wilson',
        note: 'Send proposal',
        status: 'closed'
      },
      {
        id: 4,
        entityName: 'Company D',
        taskType: 'Follow-up',
        date: new Date(),
        taskTime: new Date(Date.now() + 3600000),
        contactPerson: 'Alice Brown',
        note: 'Review contract details',
        status: 'open'
      },
      {
        id: 5,
        entityName: 'Company E',
        taskType: 'Meeting',
        date: new Date(Date.now() + 172800000), // day after tomorrow
        taskTime: new Date(Date.now() + 176400000),
        contactPerson: 'Charlie Davis',
        note: 'Project kickoff',
        status: 'open'
      }
    ];
    return { tasks };
  }
} 