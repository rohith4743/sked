import { Component, Input } from '@angular/core';
import { Event } from '../event';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { DateTimeFormatPipe } from '../date-time-format.pipe';
import { CommonModule } from '@angular/common';
import { UtilService } from '../util.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [ReactiveFormsModule, DateTimeFormatPipe, CommonModule, NgSelectModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {

  @Input() eventData!: Event;
  isRepeat: boolean = true;

  constructor(private utilService: UtilService){}
  categories = this.utilService.getCategories();

  eventForm = new FormGroup({
    eventname : new FormControl("", [Validators.required]),
    category : new FormControl(""),
    description : new FormControl(""),
    allday : new FormControl(false),
    startdate : new FormControl(new Date(), Validators.required),
    starttime : new FormControl(""),
    enddate : new FormControl(new Date(), Validators.required),
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
  }, {validators: [this.utilService.endTimeRequiredValidator, this.utilService.startTimeRequiredValidator, this.repeatEndDateRequiredValidator()]})

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
        },   
        
      });
    }

    this.eventForm.get('repeat')?.valueChanges.subscribe(val => {
      this.isRepeat = Object.values(val).some(v => v);
      this.eventForm.updateValueAndValidity(); 
    });
  }

  get repeatFormGroup(): FormGroup {
    return this.eventForm.get('repeat') as FormGroup;
  }

  repeatEndDateRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const repeatNever = control.get('repeatNever');
      const repeatEndDate = control.get('repeatEndDate');
      return this.isRepeat && repeatNever && repeatEndDate && !repeatNever.value && !repeatEndDate.value ? { 'repeatEndDateRequired': true } : null;
    };
  }


}
