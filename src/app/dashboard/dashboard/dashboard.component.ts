import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { ActivityApiService } from '../activity-api.service';
import { activity } from '../models/activity.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activites:activity[] = [];
  data: any;
  options: any;
  today:Date=new Date("2024-11-03")
 constructor(private apiService: ActivityApiService) {}

  ngOnInit() {
    this.loadActivityData();
    this.loadChart();
 }

  loadActivityData() {
    console.log(this.today.toISOString().split('T')[1])
   this.apiService.getDayActivity(this.today.toISOString().split('T')[0]).subscribe({
   
      next: (data) => {
        this.activites = data  ;  
      
      },
      error: (error) => console.error('Failed to load Activity data:', error)
    });
  }

  loadChart() {
    const last30Days = this.getLast30Days(); // Generate dates for the last 30 days
    let averageWorkHours:number[] = Array(30).fill(0); // Initialize with zeros
      
    // Fetch average work hours data
    this.apiService.getAverageWorkTime().subscribe({
      next: (average) => {
        // Map received data to hours and update any missing data with 0
       averageWorkHours=average.map((a)=>a/60)
    
        while (averageWorkHours.length < 30) {
          averageWorkHours.push(0);
        }
  
        // Update chart with final data and labels
        this.updateChart(last30Days, averageWorkHours);

      },
      error: (error) => console.error('Failed to load Average data:', error)
    });
  }
  
  // Helper function to generate last 30 days
  getLast30Days(): string[] {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
    }
    return days;
  }
  
  // Function to update chart data and options
  updateChart(labels: string[], dataPoints: number[]) {
    this.data = {
      labels: labels,
      datasets: [
        {
          label: 'Average Work Time (hrs)',
          data: dataPoints,
          borderColor: '#4a7dff',
          fill: false,
          tension: 0.4
        }
      ]
    };
  
    this.options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Last 30 Days'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Average Work Time (hrs)'
          },
          beginAtZero: true,
          max: 10 // Adjust based on expected maximum work hours
        }
      }
    };
  }
  
  get formattedToday(): string {
    return this.today.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
  }

  // Update day based on index (-1 for left, +1 for right)
  updateDay(index: number) {
    const newDate = new Date(this.today);
    newDate.setDate(newDate.getDate() + index);

    // Allow navigation only if the new date is today or earlier
    if (newDate <= new Date()) {
      this.today = newDate;
    }
    this.loadActivityData() 
  }
}





