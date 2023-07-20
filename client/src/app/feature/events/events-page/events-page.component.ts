import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-events-page',
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.css']
})
export class EventsPageComponent implements OnInit {

  isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
  }

}
