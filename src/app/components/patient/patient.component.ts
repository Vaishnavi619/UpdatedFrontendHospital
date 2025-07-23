
import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  imports:[CommonModule,RouterModule,]
})
export class PatientComponent {
  constructor(private http: HttpClient,private patientService:PatientService) {}


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const csvContent = e.target.result;
        const rows = csvContent
          .split('\n')
          .map((row: string) => row.trim())
          .filter((row: string) => row);

        const seenPhones = new Set<string>();
        let hasDuplicate = false;

        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i].split(',');
          const phone = cols[3]?.trim();

          if (seenPhones.has(phone)) {
            hasDuplicate = true;
            break;
          }
          seenPhones.add(phone);
        }

        if (hasDuplicate) {
          alert('❌ Duplicate phone number found in the file. Upload cancelled.');
          return;
        }

        this.patientService.uploadPatients(file).subscribe({
          next: (response) => {
            alert(  (response || 'CSV uploaded successfully.'));
          },
          error: (err: HttpErrorResponse) => {
            let backendMsg = '';
            if (err.error) {
              if (typeof err.error === 'string') {
                backendMsg = err.error;
              } else if (err.error.message) {
                backendMsg = err.error.message;
              }
            }
            if (backendMsg.toLowerCase().includes('duplicate')) {
              alert('❌ Duplicate phone number found in the file. Upload cancelled.');
            } else {
              let msg = '❌ Upload failed.';
              if (backendMsg) {
                msg += ' ' + backendMsg;
              }
              alert(msg);
            }
          }
        });
      };

      reader.readAsText(file);
    }
  }





}
