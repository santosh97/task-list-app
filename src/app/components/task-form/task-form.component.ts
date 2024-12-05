import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule
  ]
})
export class TaskFormComponent {
  taskForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    public dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) {
    this.taskForm = this.fb.group({
      entityName: ['', Validators.required],
      taskType: ['', Validators.required],
      date: ['', Validators.required],
      taskTime: ['', Validators.required],
      contactPerson: ['', Validators.required],
      note: ['']
    });

    if (data) {
      this.isEditMode = true;
      this.taskForm.patchValue({
        ...data,
        date: this.formatDateForInput(new Date(data.date)),
        taskTime: this.formatTimeForInput(new Date(data.taskTime))
      });
    }
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private formatTimeForInput(date: Date): string {
    return date.toTimeString().split(' ')[0].substr(0, 5);
  }

  private combineDateAndTime(date: string, time: string): Date {
    const [hours, minutes] = time.split(':');
    const dateObj = new Date(date);
    dateObj.setHours(parseInt(hours), parseInt(minutes));
    return dateObj;
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const dateTime = this.combineDateAndTime(formValue.date, formValue.taskTime);

      const taskData: Task = {
        entityName: formValue.entityName,
        taskType: formValue.taskType,
        date: dateTime.toISOString(),
        taskTime: dateTime.toISOString(),
        contactPerson: formValue.contactPerson,
        note: formValue.note || '',
        status: 'open' as const
      };

      this.taskService.createTask(taskData)
        .subscribe({
          next: (response) => {
            console.log('Task created:', response);
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Error creating task:', error);
          }
        });
    }
  }
} 