import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsMyeventsPageComponent } from './events-myevents-page.component';

describe('EventsMyeventsPageComponent', () => {
  let component: EventsMyeventsPageComponent;
  let fixture: ComponentFixture<EventsMyeventsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventsMyeventsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsMyeventsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
