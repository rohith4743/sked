import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Event } from '../event';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { DateTimeFormatPipe } from '../date-time-format.pipe';
import { CommonModule } from '@angular/common';
import { UtilService } from '../util.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { EventService } from '../event.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [ReactiveFormsModule, DateTimeFormatPipe, CommonModule, NgSelectModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {

  @Input() eventData!: Event;
  @Input() dateToday: Date = new Date();
  @Output() refreshEmitter = new EventEmitter<null>();
  @ViewChild('closeButton') closebutton!: ElementRef;
  
  isRepeat: boolean = true;

  constructor(private utilService: UtilService, private eventService: EventService, private _snackBar: MatSnackBar){}
  categories = this.utilService.getCategories();

  eventForm = new FormGroup({
    eventname : new FormControl("something", [Validators.required]),
    category : new FormControl(""),
    description : new FormControl(""),
    allday : new FormControl(false),
    startdate : new FormControl(this.formatDate(new Date()), Validators.required),
    starttime : new FormControl("18:30"),
    enddate : new FormControl(this.formatDate(new Date()), Validators.required),
    endtime : new FormControl("19:30"),
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

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    if (this.eventData) {
      this.eventForm.patchValue({
        eventname: this.eventData.name || '',
        category: this.eventData.category || '',
        description: this.eventData.description || '',
        allday: this.eventData.allday || false,
        startdate: this.eventData.start ? this.formatDate(this.eventData.start) : this.formatDate(new Date()),
        starttime: this.eventData.start ? this.eventData.start.toISOString().substring(11, 16) : '',
        enddate: this.eventData.end ? this.formatDate(this.eventData.end) : this.formatDate(new Date()),
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

  private combineDateAndTime(date: string | null | undefined, time: string | null | undefined): Date {
    if (!date || !time) {
        return new Date();
    }
    const [hours, minutes] = time.split(':').map(Number);
    const combinedDate = new Date(date);

    const utcDate = new Date(combinedDate.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000 + combinedDate.getTimezoneOffset()*1000*60);
    return utcDate;
  }

  saveChanges(){
    const formValue = this.eventForm.value;
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
      repeatEndDate : formValue.repeatEndDate ?? undefined,
      id: this.eventData.id
    }
    
    this.eventService.updateEvent(newEvent, this.eventData.id).subscribe({
      next: data => {
        this.refreshEmitter.emit();
      },
      error: err => {
        this._snackBar.open(err.error.message || "unable to add event", "close");
        console.log(err.error.message);
      }
    })
  }

  deleteInstance() {
    this.eventService.deleteInstance(this.eventData.id, this.formatDate(this.dateToday)).subscribe({
      next: data => {
        this.refreshEmitter.emit();
        this.closeModal();
      },
      error: err => {
        this._snackBar.open(err.error.message || "unable to delete event instance", "close");
        console.log(err.error.message);
      }
    })
  }

  deleteEntirely() {
    this.eventService.deleteEvent(this.eventData.id).subscribe({
      next: data => {
        this.refreshEmitter.emit();
        this.closeModal();
      },
      error: err => {
        this._snackBar.open(err.error.message || "unable to delete event", "close");
        console.log(err.error.message);
      }
    })
  }

  
  
  closeModal() {
    this.closebutton.nativeElement.click();
  }


}
