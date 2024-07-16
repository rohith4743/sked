import { Component } from '@angular/core';
import { EventComponent } from '../event/event.component';
import { Event } from '../event';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { EventService } from '../event.service';
import { CommonModule } from '@angular/common';
import {NgSelectModule} from '@ng-select/ng-select'
import { UtilService } from '../util.service';
import { DateNavComponent } from '../date-nav/date-nav.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [EventComponent, ReactiveFormsModule, CommonModule, NgSelectModule, DateNavComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
  events: Event[] = [];
  allDayEvents: Event[] = [];
  nonAllDayEvents: Event[] = [];
  dateToday = new Date()

  isRepeat: boolean = false;

  categories = [
    { name: 'Business Meetings', value: 'Business Meetings' },
    { name: 'Personal Appointments', value: 'Personal Appointments' },
    { name: 'Health & Wellness', value: 'Health & Wellness' },
    { name: 'Education & Training', value: 'Education & Training' },
    { name: 'Travel & Commuting', value: 'Travel & Commuting' },
    { name: 'Home Maintenance', value: 'Home Maintenance' },
    { name: 'Social Events', value: 'Social Events' },
    { name: 'Recreation & Leisure', value: 'Recreation & Leisure' },
    { name: 'Shopping', value: 'Shopping' },
    { name: 'Family Time', value: 'Family Time' },
    { name: 'Volunteering', value: 'Volunteering' },
    { name: 'Work Tasks', value: 'Work Tasks' },
    { name: 'Financial Management', value: 'Financial Management' },
    { name: 'Cultural Activities', value: 'Cultural Activities' },
    { name: 'Other', value: 'Other' }
  ];
  
  
  constructor(private eventService: EventService, private utilService: UtilService, private _snackBar: MatSnackBar){}

  addEventForm = new FormGroup({
    eventname : new FormControl("", Validators.required),
    category : new FormControl("Other"),
    description : new FormControl(""),
    allday : new FormControl(false),
    startdate : new FormControl(this.formatDate(new Date()), Validators.required),
    starttime : new FormControl(""),
    enddate : new FormControl(this.formatDate(new Date()), Validators.required),
    endtime : new FormControl(""),
    repeat : new FormGroup({
      sun : new FormControl(false),
      mon : new FormControl(false),
      tue : new FormControl(false),
      wed : new FormControl(false),
      thu : new FormControl(false),
      fri : new FormControl(false),
      sat : new FormControl(false),
    }),
    repeatEndDate: new FormControl(new Date()),
    repeatNever: new FormControl(true) 
  }, {validators: [this.repeatEndDateRequiredValidator(), this.utilService.startTimeRequiredValidator, this.utilService.endTimeRequiredValidator]})

  ngOnInit(): void {
    this.loadEvents(new Date());
    this.addEventForm.get('repeat')?.valueChanges.subscribe(val => {
      this.isRepeat = Object.values(val).some(v => v);
      this.addEventForm.updateValueAndValidity(); 
    });
  }


  repeatEndDateRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const repeatNever = control.get('repeatNever');
      const repeatEndDate = control.get('repeatEndDate');
      return this.isRepeat && repeatNever && repeatEndDate && !repeatNever.value && !repeatEndDate.value ? { 'repeatEndDateRequired': true } : null;
    };
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }


  updateEvents($event: Date) {
    this.dateToday = $event;
    this.loadEvents($event);
  }

  get repeatFormGroup(): FormGroup {
    return this.addEventForm.get('repeat') as FormGroup;
  }
  
  private combineDateAndTime(date: string | null | undefined, time: string | null | undefined): Date {
    if (!date || !time) {
        return new Date();
    }
    const [hours, minutes] = time.split(':').map(Number);
    const combinedDate = new Date(date);

    const utcDate = new Date(combinedDate.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000);
    return utcDate;
  }

  
  addEvent() {
    
    const formValue = this.addEventForm.value;
    var start = new Date();
    var end = new Date();
    if (formValue.allday) {
      start = this.combineDateAndTime(formValue.startdate, "00:00");
      end = this.combineDateAndTime(formValue.enddate, "23:59:59");
    } else {
      start = this.combineDateAndTime(formValue.startdate, formValue.starttime);
      end = this.combineDateAndTime(formValue.enddate, formValue.endtime);
    }
    const newEvent: Event = {
      name: formValue.eventname ?? '',
      start : start,
      end : end,
      repeat: {
        sun: formValue.repeat?.sun ?? false,
        mon: formValue.repeat?.mon ?? false,
        tue: formValue.repeat?.tue ?? false,
        wed: formValue.repeat?.wed ?? false,
        thu: formValue.repeat?.thu ?? false,
        fri: formValue.repeat?.fri ?? false,
        sat: formValue.repeat?.sat ?? false,
      },
      category: formValue.category ?? '',
      allday: formValue.allday ?? false,
      description : formValue.description ?? '',
      repeatNever: formValue.repeatNever ?? false,
      repeatEndDate : formValue.repeatEndDate ?? undefined
    }
    
    this.eventService.addEvent(newEvent).subscribe({
      next: data => {
        this.loadEvents(new Date());
      },
      error: err => {
        this._snackBar.open(err.error.message || "unable to add event", "close");
        console.log(err.error.message);
      }
    })
  }

  loadEvents(dateReq: Date): void {
    const date = this.formatDate(dateReq)
    this.eventService.getTasks(date).subscribe({
      next: data => {
        this.events = data.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }));
        console.log(this.events);
        this.allDayEvents = this.events.filter(event => event.allday);
        this.nonAllDayEvents = this.events
          .filter(event => !event.allday)
          .sort((a, b) => {
            if (a.start.getTime() === b.start.getTime()) {
              return a.end.getTime() - b.end.getTime();
            }
            return a.start.getTime() - b.start.getTime();
        });
      },
      error: err => {
        this._snackBar.open(err.error.message || "something went wrong", "close");
        console.log(err.error.message);
      }
    });
}
}
