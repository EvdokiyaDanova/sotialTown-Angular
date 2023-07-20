import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from 'src/app/core/event.service';

@Component({
  selector: 'app-events-new-page',
  templateUrl: './events-new-page.component.html',
  styleUrls: ['./events-new-page.component.css']
})
export class EventsNewPageComponent implements OnInit {

  constructor(private router: Router, private eventService: EventService) { }

  ngOnInit(): void {
  }
  
  submitNewEvent(newEventForm: NgForm): void {
    console.log(newEventForm.value);
    this.eventService.addEvent$(newEventForm.value).subscribe({
      next: (event) => {
        console.log(event);
        this.router.navigate(['/events']);
      },
      error: (error) => {
        console.error(error);
      }
    })

  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

}
