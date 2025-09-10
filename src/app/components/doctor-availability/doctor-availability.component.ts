import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DoctorAvailability, DoctorAvailabilityService } from '../../services/doctor-availability.service';

type Day =
  | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY'
  | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

@Component({
  selector: 'app-doctor-availability',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './doctor-availability.component.html',
  styleUrls: ['./doctor-availability.component.css']
})
export class DoctorAvailabilityComponent implements OnInit {
  doctorId!: number;

  days: Day[] = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];

  // New availability form model
  newAvailability = {
    dayOfWeek: '' as Day | '',
    startTime: '',
    endTime: ''
  };

  // List of current rows
  availabilities: DoctorAvailability[] = [];

  // Editing state
  editingId: number | null = null;
  editRow: { dayOfWeek: Day; startTime: string; endTime: string } | null = null;

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private availabilityService: DoctorAvailabilityService
  ) {}

  ngOnInit(): void {
    this.doctorId = Number(this.route.snapshot.paramMap.get('doctorId') || this.route.snapshot.paramMap.get('id'));
    if (!this.doctorId) {
      alert('Doctor ID not found in route.');
      this.router.navigate(['/']);
      return;
    }
    this.loadAvailabilities();
  }

  // Load rows for this doctor
  loadAvailabilities(): void {
    this.loading = true;
    this.availabilityService.getAvailabilityByDoctor(this.doctorId).subscribe({
      next: (rows) => {
        this.availabilities = this.sortAvailabilities(rows || []);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch availabilities', err);
        this.loading = false;
        alert('Failed to load availability.');
      }
    });
  }

  // Add new row
  addAvailability(): void {
    if (!this.newAvailability.dayOfWeek || !this.newAvailability.startTime || !this.newAvailability.endTime) {
      alert('Please select day, start time, and end time.');
      return;
    }
    if (!this.isTimeRangeValid(this.newAvailability.startTime, this.newAvailability.endTime)) {
      alert('End time must be after start time.');
      return;
    }

    const payload = {
      dayOfWeek: this.newAvailability.dayOfWeek.toString(),
      startTime: this.newAvailability.startTime, // "HH:mm"
      endTime: this.newAvailability.endTime
    };

    this.availabilityService.addAvailability(this.doctorId, payload).subscribe({
      next: () => {
        this.newAvailability = { dayOfWeek: '', startTime: '', endTime: '' };
        this.loadAvailabilities();
      },
      error: (err) => {
        console.error('Add failed', err);
        alert('Failed to add availability.');
      }
    });
  }

  // Begin editing a row
  beginEdit(row: DoctorAvailability): void {
    this.editingId = row.doctorAvailibilityId;
    this.editRow = {
      dayOfWeek: row.dayOfWeek,
      startTime: row.startTime,
      endTime: row.endTime
    };
  }

  // Save edit
  saveEdit(row: DoctorAvailability): void {
    if (!this.editRow) return;

    if (!this.isTimeRangeValid(this.editRow.startTime, this.editRow.endTime)) {
      alert('End time must be after start time.');
      return;
    }

    this.availabilityService.updateAvailability(row.doctorAvailibilityId, {
      dayOfWeek: this.editRow.dayOfWeek,
      startTime: this.editRow.startTime,
      endTime: this.editRow.endTime
    }).subscribe({
      next: () => {
        this.editingId = null;
        this.editRow = null;
        this.loadAvailabilities();
      },
      error: (err) => {
        console.error('Update failed', err);
        alert('Failed to update availability.');
      }
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editRow = null;
  }

  // Delete row
  deleteAvailability(row: DoctorAvailability): void {
    if (!confirm('Delete this availability?')) return;

    this.availabilityService.deleteAvailability(row.doctorAvailibilityId).subscribe({
      next: () => this.loadAvailabilities(),
      error: (err) => {
        console.error('Delete failed', err);
        alert('Failed to delete availability.');
      }
    });
  }

  // Helpers
  private isTimeRangeValid(start: string, end: string): boolean {
    // Compare in "HH:mm"
    return start < end;
  }

  private sortAvailabilities(rows: DoctorAvailability[]): DoctorAvailability[] {
    const dayIndex: Record<Day, number> = {
      MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, THURSDAY: 4,
      FRIDAY: 5, SATURDAY: 6, SUNDAY: 7
    };
    return rows.slice().sort((a, b) => {
      const d = dayIndex[a.dayOfWeek as Day] - dayIndex[b.dayOfWeek as Day];
      if (d !== 0) return d;
      return a.startTime.localeCompare(b.startTime);
    });
  }
}
