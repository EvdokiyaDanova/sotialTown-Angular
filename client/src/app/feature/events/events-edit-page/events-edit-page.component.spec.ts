import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsEditPageComponent } from './events-edit-page.component';

describe('EventsEditPageComponent', () => {
  let component: EventsEditPageComponent;
  let fixture: ComponentFixture<EventsEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventsEditPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
