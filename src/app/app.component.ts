import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TaskListComponent } from './components/task-list/task-list.component';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <mat-toolbar color="primary">
        <span>Task Manager</span>
      </mat-toolbar>
      <app-task-list></app-task-list>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
  `],
  standalone: true,
  imports: [MatToolbarModule, TaskListComponent]
})
export class AppComponent {}
