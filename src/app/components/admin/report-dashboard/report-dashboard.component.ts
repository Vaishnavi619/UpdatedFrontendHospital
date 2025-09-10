import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartConfiguration, ChartType } from 'chart.js';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';

@Component({
  selector: 'app-report-dashboard',
  templateUrl: './report-dashboard.component.html',
  styleUrls: ['./report-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, NgChartsModule,BackButtonComponent]
})
export class ReportDashboardComponent implements OnInit {

  barChartData: ChartConfiguration<'bar'>['data'] = {
  labels: [],
  datasets: [{ data: [], label: 'Appointments' }]
};
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true }
    }
  };
  barChartType: 'bar' = 'bar';
pieChartType: 'pie' = 'pie';


  // Bill status chart (pie)
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{ data: [] }]
  };
  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    }
  };


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAppointmentsChart();
    this.loadBillStatusChart();
  }

  loadAppointmentsChart() {
    this.http.get<any[]>('http://localhost:8081/api/reports/appointments-per-month')
      .subscribe(data => {
        this.barChartData.labels = data.map(d => d.month);
        this.barChartData.datasets[0].data = data.map(d => d.count);
      });
  }

  loadBillStatusChart() {
    this.http.get<any[]>('http://localhost:8081/api/reports/bills-status')
      .subscribe(data => {
        this.pieChartData.labels = data.map(d => d.status);
        this.pieChartData.datasets[0].data = data.map(d => d.count);
      });
  }
}
