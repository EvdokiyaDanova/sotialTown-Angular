import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsideComponent } from './aside/aside.component';
import { PostListComponent } from './post-list/post-list.component';
import { EventListItemComponent } from './event-list-item/event-list-item.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventsPageComponent } from './events-page/events-page.component';
import { EventsRoutingModule } from './events-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { EventsDetailPageComponent } from './events-detail-page/events-detail-page.component';
import { EventsNewPageComponent } from './events-new-page/events-new-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventsFavoritePageComponent } from './events-favorite-page/events-favorite-page.component';
import { EventsMyeventsPageComponent } from './events-myevents-page/events-myevents-page.component';

@NgModule({
  declarations: [
    EventListComponent,
    AsideComponent,
    EventListItemComponent,
    PostListComponent,
    EventsPageComponent,
    EventsDetailPageComponent,
    EventsNewPageComponent,
    EventsFavoritePageComponent,
    EventsMyeventsPageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    EventsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ], exports: [

  ]
})
export class EventsModule { }
