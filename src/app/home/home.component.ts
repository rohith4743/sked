import { Component } from '@angular/core';
import { EventComponent } from '../event/event.component';
import { Event } from '../event';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [EventComponent, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
  eventData: Event = {
    name: "play",
    id : "someid",
    start : new Date(),
    end : new Date(),
    repeat: {
      sun: false,
      mon : false,
      tue: false,
      wed: false, 
      thu: false,
      fri: false,
      sat : false
    },
    category:"1",
    allday: false,
    username:"rohith",
    description : "some event"

  }

  addEventForm = new FormGroup({
    eventname : new FormControl(""),
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
  

  addEvent() {
    const formValue = this.addEventForm.value;
    console.log(formValue)
    const newEvent: Event = {
      name: formValue.eventname ?? '',
      start : new Date(),
      end : new Date(),
      repeat: {
        sun: false,
        mon : false,
        tue: false,
        wed: false, 
        thu: false,
        fri: false,
        sat : false
      },
      category:"1",
      allday: false,
      username:"rohith",
      description : "some event"
    }
    console.log(newEvent);
  }
}
