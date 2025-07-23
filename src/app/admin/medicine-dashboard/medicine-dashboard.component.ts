import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MedicineService } from '../../services/medicine.service';

@Component({
  selector: 'app-medicine-dashboard',
  templateUrl: './medicine-dashboard.component.html',
  styleUrls: ['./medicine-dashboard.component.css'],
  imports:[RouterModule]
})
export class MedicineDashboardComponent {
  constructor(private http: HttpClient,private medicineService:MedicineService) {}

  triggerFileInput() {
    const input = document.getElementById('fileInput') as HTMLInputElement;
    if (input) {
      input.click();
    }
  }

   onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.medicineService.uploadMedicines(file).subscribe({
      next: (res: string) => {
        alert( res); 
      },
      error: (err) => {
        let errorMsg = '❌ Upload failed.';
        if (err?.error?.data) {
          errorMsg += '\n' + err.error.data;
        }
        alert(errorMsg);
      }
    });
  }
}
