import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskFilterComponent } from '../task-filter/task-filter.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule
  ]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  currentFilters: any = {};

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks(this.currentFilters)
      .subscribe(tasks => this.tasks = tasks);
  }

  openNewTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  openFilterDialog(): void {
    const dialogRef = this.dialog.open(TaskFilterComponent, {
      width: '400px',
      data: this.currentFilters
    });

    dialogRef.afterClosed().subscribe(filters => {
      if (filters) {
        this.currentFilters = filters;
        this.loadTasks();
      }
    });
  }

  updateTaskStatus(task: Task): void {
    const newStatus = task.status === 'open' ? 'closed' : 'open';
    this.taskService.updateStatus(task.id!, newStatus)
      .subscribe(() => this.loadTasks());
  }

  deleteTask(taskId: number | undefined): void {
    if (taskId && confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId)
        .subscribe(() => this.loadTasks());
    }
  }

  openEditDialog(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '500px',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }
} 