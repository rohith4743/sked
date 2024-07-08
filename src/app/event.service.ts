import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Event } from './event';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Event[]> {
    const tasks :Event[] = [{
      name: "play",
      id : "someid",
      start : new Date(),
      end : new Date(new Date().getTime() + 60 * 60 * 1000),
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
  
    },
    {
      name: "play",
      id : "someid",
      start : new Date(),
      end : new Date(new Date().getTime() + 60 * 60 * 1000 * 24 * 2),
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
      allday: true,
      username:"rohith",
      description : "some event"
  
    }, {
      name: "play",
      id : "someid",
      start : new Date(new Date().getTime() + 60 * 60 * 500 * 3),
      end : new Date(new Date().getTime() + 60 * 60 * 500 * 5),
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
  
    }, {
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
      allday: true,
      username:"rohith",
      description : "some event"
  
    }];
    return of(tasks);
  }


}
