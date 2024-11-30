import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { ActivityApiService } from '../../dashboard/activity-api.service';
import { ActivatedRoute } from '@angular/router';
import { activity, empActivity } from '../../dashboard/models/activity.model';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [ChartModule, CommonModule],
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  id: number | null = null;
  chartData: any;
  chartOptions: any;
  activities: empActivity[] = [];
  lastTenDaysActivities: empActivity[] = [];
  latestActivity: empActivity | null = null;

  constructor(
    private apiService: ActivityApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.loadActivityData(this.id);
    }
  }

  loadActivityData(id: number) {
    if (id !== null) {
      this.apiService.getActivtyById(id).subscribe({
        next: (data) => {
          this.activities = data;
          this.latestActivity = this.activities[this.activities.length - 1] || null;
          this.lastTenDaysActivities = this.getLastTenDaysActivities();
          this.loadChart();
        },
        error: (error) => console.error('Failed to load activity data:', error)
      });
    }
  }

  getLastTenDaysActivities(): empActivity[] {
    return this.activities.slice(-10);
  }

  loadChart() {
    const dates = this.lastTenDaysActivities.map(activity => activity.date);
    const workTimes = this.lastTenDaysActivities.map(activity =>
      this.convertToHours(activity.work_time)
    );
   
    this.chartData = {
      labels: dates,
      datasets: [
        {
          label: 'Work Time (Hours)',
          backgroundColor: '#4a7dff',
          data: workTimes
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Hours'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    };
  }

  convertToHours(time: string): number {
    if (!time) return 0; // Handle null or empty string
    
    let hours = 0;
    let minutes = 0;
  
    // Match the hour and minute parts from the string
    const hourMatch = time.match(/(\d+)\s*h/); // Matches '08 h', '06 h'
    const minuteMatch = time.match(/(\d+)\s*m/); // Matches '45 m', '40 m'
  
    if (hourMatch) {
      hours = parseInt(hourMatch[1], 10); // Extract hours
    }
    if (minuteMatch) {
      minutes = parseInt(minuteMatch[1], 10); // Extract minutes
    }
  
    return hours + minutes / 60; // Convert to hours
  }


  openFiles(cin:URL,cnss:URL){
    const cinLink = document.createElement('a');
    cinLink.href = cin.toString();
    cinLink.target = '_blank';
    cinLink.rel = 'noopener noreferrer'; // For security
    cinLink.click();


    const cnssLink = document.createElement('a');
    cnssLink.href = cnss.toString();
    cnssLink.target = '_blank';
    cnssLink.rel = 'noopener noreferrer'; // For security
    cnssLink.click();


   
  }
}
