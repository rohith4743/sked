import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-date-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-nav.component.html',
  styleUrl: './date-nav.component.css'
})


export class DateNavComponent {
  @Output() dateChange = new EventEmitter<Date>();

  isCollapsed = false;
  selectedDate: Date = new Date();
  selectedYear: number = this.selectedDate.getFullYear();
  selectedMonth: number = this.selectedDate.getMonth();
  selectedDay: number = this.selectedDate.getDate();
  years: number[] = Array.from({ length: 11 }, (_, i) => 2020 + i);
  months: { name: string, value: number }[] = [
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 1 },
    { name: 'Mar', value: 2 },
    { name: 'Apr', value: 3 },
    { name: 'May', value: 4 },
    { name: 'Jun', value: 5 },
    { name: 'Jul', value: 6 },
    { name: 'Aug', value: 7 },
    { name: 'Sep', value: 8 },
    { name: 'Oct', value: 9 },
    { name: 'Nov', value: 10 },
    { name: 'Dec', value: 11 }
  ];

  // For circular scrolling
  displayedYears: number[] = [];
  displayedMonths: { name: string, value: number }[] = [];
  displayedDays: { date: number, day: string }[] = [];


  ngOnInit() {
    this.updateDisplayedYears();
    this.updateDisplayedMonths();
    this.updateVisibleDays();
    this.dateChange.emit(this.selectedDate);
  }


  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  updateSelectedDate(date: Date) {
    if (date.getFullYear() > 2030 || (date.getFullYear() === 2030 && date.getMonth() > 11) || (date.getFullYear() === 2030 && date.getMonth() === 11 && date.getDate() > 31)) {
      return; // Prevent selection beyond December 31, 2030
    }
    this.selectedDate = date;
    this.selectedYear = date.getFullYear();
    this.selectedMonth = date.getMonth();
    this.selectedDay = date.getDate();
    this.updateDisplayedYears();
    this.updateDisplayedMonths();
    this.updateVisibleDays();
    this.dateChange.emit(this.selectedDate);
  }

  updateDisplayedYears() {
    const currentYearIndex = this.years.indexOf(this.selectedYear);
    this.displayedYears = this.getCircularArray(this.years, currentYearIndex);
  }

  updateDisplayedMonths() {
    this.displayedMonths = this.getCircularArray(this.months, this.selectedMonth );
  }

  updateVisibleDays() {
    const daysInMonth = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
    const daysArray = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(this.selectedYear, this.selectedMonth, i);
      daysArray.push({ date: i, day: date.toLocaleDateString('en-US', { weekday: 'short' }) });
    }

    const selectedIndex = daysArray.findIndex(d => d.date === this.selectedDay);
    this.displayedDays = this.getCircularArray(daysArray, selectedIndex);
  }

  getCircularArray(arr: any[], index: number): any[] {
    const circularArr = [];
    const arrLength = arr.length;
    const ind = 4

    for (let i = -ind; i <= ind; i++) {
      circularArr.push(arr[(index + i + arrLength) % arrLength]);
    }

    return circularArr;
  }

  selectYear(year: number) {
    this.selectedYear = year;
    this.updateSelectedDate(new Date(this.selectedYear, this.selectedMonth, this.selectedDay));
  }

  selectMonth(month: number) {
    this.selectedMonth = month;
    this.updateSelectedDate(new Date(this.selectedYear, this.selectedMonth, this.selectedDay));
  }

  selectDay(day: number) {
    this.selectedDay = day;
    this.updateSelectedDate(new Date(this.selectedYear, this.selectedMonth, this.selectedDay));
  }

  prevYear() {
    this.selectedYear--;
    if (this.selectedYear < 2020) {
      this.selectedYear = 2020;
    }
    this.updateSelectedDate(new Date(this.selectedYear, this.selectedMonth, this.selectedDay));
  }

  nextYear() {
    this.selectedYear++;
    if (this.selectedYear > 2030) {
      this.selectedYear = 2030;
    }
    this.updateSelectedDate(new Date(this.selectedYear, this.selectedMonth, this.selectedDay));
  }

  prevMonth() {
    this.selectedMonth--;
    if (this.selectedMonth < 0) {
      this.selectedMonth = 11;
      this.prevYear();
    } else {
      this.updateSelectedDate(new Date(this.selectedYear, this.selectedMonth, this.selectedDay));
    }
  }

  nextMonth() {
    this.selectedMonth++;
    if (this.selectedMonth > 11) {
      this.selectedMonth = 0;
      this.nextYear();
    } else {
      this.updateSelectedDate(new Date(this.selectedYear, this.selectedMonth, this.selectedDay));
    }
  }

  prevDay() {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(this.selectedDate.getDate() - 1);
    this.updateSelectedDate(newDate);
  }

  nextDay() {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(this.selectedDate.getDate() + 1);
    this.updateSelectedDate(newDate);
  }

  prevWeek() {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(this.selectedDate.getDate() - 7);
    this.updateSelectedDate(newDate);
  }

  nextWeek() {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(this.selectedDate.getDate() + 7);
    this.updateSelectedDate(newDate);
  }

  container_width: number | undefined;

  
  
}




