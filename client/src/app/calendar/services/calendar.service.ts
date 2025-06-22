import { Injectable } from '@angular/core';

interface DateInfo {
  id :number
  day: number;
  weekDay: number;
  month: number;
  year: number;
}
@Injectable({
  providedIn: 'root',
})


export class CalendarService {
   date:Date=new Date()
  constructor() {
  }

  private numDays(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  getDaysInMonth(month : number,year:number): DateInfo[][] {
    
    const numDays = this.numDays(year, month);

    const weeks: DateInfo[][] = [];
    let week: DateInfo[] = [];

    // Get the first day of the current month
    const firstDayOfMonth = new Date(year, month, 1);

    // Determine the first day to display on the calendar (may include the previous month's days)
    const startDay = firstDayOfMonth.getDay();
    const startDate = new Date(year, month, 1 - startDay);

    // We will fill 6 weeks (6 * 7 days = 42 cells)
    const totalCells = 6 * 7;

    for (let i = 0; i < totalCells; i++) {
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);

      // Create the DateInfo object
      const dateInfo: DateInfo = {
        id: i,
        day: currentDay.getDate(),
        weekDay: currentDay.getDay() + 1, // Adjusted to make Sunday=1
        month: currentDay.getMonth() + 1, // Month is zero-indexed
        year: currentDay.getFullYear(),
      };

      // Push date info to the current week
      week.push(dateInfo);

      // If the week has 7 days, push it to weeks array and start a new week
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    // If there's any remaining days, add them as a final week
    if (week.length > 0) {
      weeks.push(week);
    }

    return weeks;
  }


  
  
}
