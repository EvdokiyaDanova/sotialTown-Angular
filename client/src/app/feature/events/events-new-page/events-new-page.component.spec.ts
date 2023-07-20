import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsNewPageComponent } from './events-new-page.component';

describe('EventsNewPageComponent', () => {
  let component: EventsNewPageComponent;
  let fixture: ComponentFixture<EventsNewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventsNewPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsNewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
