import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-task-filter',
  templateUrl: './task-filter.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule
  ]
})
export class TaskFilterComponent {
  filterForm: FormGroup;
  taskTypes = ['Call', 'Meeting', 'Email', 'Follow-up', 'Other'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.filterForm = this.fb.group({
      taskType: [''],
      status: [''],
      contactPerson: [''],
      entityName: [''],
      startDate: [''],
      endDate: ['']
    });

    if (data) {
      this.filterForm.patchValue(data);
    }
  }

  applyFilters(): void {
    this.dialogRef.close(this.filterForm.value);
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.dialogRef.close({});
  }
} 