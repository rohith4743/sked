import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTimeFormat',
  standalone: true
})
export class DateTimeFormatPipe implements PipeTransform {

  transform(value: Date | undefined): string {
    if (!value) return '';

    const month = (value.getMonth() + 1).toString().padStart(2, '0');
    const day = value.getDate().toString().padStart(2, '0');
    const year = value.getFullYear();
    const hours = value.getHours().toString().padStart(2, '0');
    const minutes = value.getMinutes().toString().padStart(2, '0');

    const formattedDate = `${month}/${day}/${year}`;
    const formattedTime = `${hours}:${minutes}`;

    return `${formattedDate} ${formattedTime}`;
  }

}
