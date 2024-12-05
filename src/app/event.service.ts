import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Event } from './event';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EventService {


  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getTasks(date: string): Observable<Event[]> {
    const params = {
      "date" : date
    }
    return this.http.get<Event[]>(`${this.apiUrl}/event/get-by-date`, {params});
  }

  addEvent(event: Event) {
    return this.http.post<any>(`${this.apiUrl}/event/add`, event)
  }

  updateEvent(event: Event, id: number | undefined){
    return this.http.post<any>(`${this.apiUrl}/event/edit/${id}`, event)
  }

  deleteInstance(id: number | undefined, date: string) {
    return this.http.delete(`${this.apiUrl}/event/delete/${id}/${date}`)
  }

  deleteEvent(id : number | undefined) {
    return this.http.delete(`${this.apiUrl}/event/delete/${id}`);
  }


}
