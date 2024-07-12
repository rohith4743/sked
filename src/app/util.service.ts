import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

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

  constructor() {}

  getCategories() {
    return this.categories;
  }

  startTimeRequiredValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const allDay = control.get('allday');
    const startTime = control.get('starttime');
    return allDay && startTime && allDay.value === false && !startTime.value ? { 'startTimeRequired': true } : null;
  };
  
  endTimeRequiredValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const allDay = control.get('allday');
    const endTime = control.get('endtime');
    return allDay && endTime && allDay.value === false && !endTime.value ? { 'endTimeRequired': true } : null;
  };
}
