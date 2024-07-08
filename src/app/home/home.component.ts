import { Component } from '@angular/core';
import { EventComponent } from '../event/event.component';
import { Event } from '../event';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../event.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [EventComponent, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  events: Event[] = [];
  allDayEvents: Event[] = [];
  nonAllDayEvents: Event[] = [];
  
  constructor(private eventService: EventService){}

  ngOnInit(): void {
    this.loadEvents()
  }

  
  addEventForm = new FormGroup({
    eventname : new FormControl("", Validators.required),
    category : new FormControl(""),
    description : new FormControl(""),
    allday : new FormControl(false),
    startdate : new FormControl(new Date()),
    starttime : new FormControl(""),
    enddate : new FormControl(new Date()),
    endtime : new FormControl(""),
    repeat : new FormGroup({
      sun : new FormControl(false),
      mon : new FormControl(false),
      tue : new FormControl(false),
      wed : new FormControl(false),
      thu : new FormControl(false),
      fri : new FormControl(false),
      sat : new FormControl(false),
    })
  })

  get repeatFormGroup(): FormGroup {
    return this.addEventForm.get('repeat') as FormGroup;
  }
  
  private combineDateAndTime(date: Date |null | undefined, time: string |null| undefined): Date {
    if (!date || !time) {
      return new Date()
    }
    const [hours, minutes] = time.split(':').map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes, 0, 0);
    return combinedDate;
  }
  
  addEvent() {
    const formValue = this.addEventForm.value;
    const start = this.combineDateAndTime(formValue.startdate, formValue.starttime);
    const end = this.combineDateAndTime(formValue.enddate, formValue.endtime);
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
      username:"rohith",
      description : formValue.description ?? ''
    }
  }

  loadEvents(): void {
    this.eventService.getTasks().subscribe({
      next: data => {
        this.events = data;
        this.allDayEvents = this.events.filter(event => event.allday);
        this.nonAllDayEvents = this.events
          .filter(event => !event.allday)
          .sort((a, b) => {
            if (a.start === b.start) {
              return a.end.getTime() - b.end.getTime();
            }
            return a.start.getTime() - b.start.getTime();
    });
      },
      error: err => console.log(err)
       
    });
  }
}
