import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsFavoritePageComponent } from './events-favorite-page.component';

describe('EventsFavoritePageComponent', () => {
  let component: EventsFavoritePageComponent;
  let fixture: ComponentFixture<EventsFavoritePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventsFavoritePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsFavoritePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
