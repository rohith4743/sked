import { Component, Input } from '@angular/core';
import { Event } from '../event';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { repeat } from 'rxjs';
import { DateTimeFormatPipe } from '../date-time-format.pipe';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [ReactiveFormsModule, DateTimeFormatPipe],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {

  @Input() eventData!: Event;

  eventForm = new FormGroup({
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

  ngOnInit(): void {
    if (this.eventData) {
      this.eventForm.patchValue({
        eventname: this.eventData.name || '',
        category: this.eventData.category || '',
        description: this.eventData.description || '',
        allday: this.eventData.allday || false,
        startdate: this.eventData.start ? new Date(this.eventData.start) : new Date(),
        starttime: this.eventData.start ? this.eventData.start.toISOString().substring(11, 16) : '',
        enddate: this.eventData.end ? new Date(this.eventData.end) : new Date(),
        endtime: this.eventData.end ? this.eventData.end.toISOString().substring(11, 16) : '',
        repeat: {
          sun: this.eventData.repeat.sun || false,
          mon: this.eventData.repeat.mon || false,
          tue: this.eventData.repeat.tue || false,
          wed: this.eventData.repeat.wed || false,
          thu: this.eventData.repeat.thu || false,
          fri: this.eventData.repeat.fri || false,
          sat: this.eventData.repeat.sat || false,
        }
        
      });
    }
  }

  get repeatFormGroup(): FormGroup {
    return this.eventForm.get('repeat') as FormGroup;
  }


}
