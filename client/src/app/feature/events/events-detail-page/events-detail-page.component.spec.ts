import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsDetailPageComponent } from './events-detail-page.component';

describe('EventsDetailPageComponent', () => {
  let component: EventsDetailPageComponent;
  let fixture: ComponentFixture<EventsDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventsDetailPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
