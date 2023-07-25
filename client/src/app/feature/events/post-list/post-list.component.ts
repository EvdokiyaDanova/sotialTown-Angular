import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IPost, IUser } from '../../../core/interfaces';
import { PostService } from '../../../core/post.service';
import { BehaviorSubject, Observable, Subscription} from 'rxjs';
import {  map,  take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import { IconService } from 'src/app/core/icon.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  icons: { [key: string]: any };
  now = new Date();

  @Input() eventId: string;

  postList: IPost[];
  isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$;
  currentUser$: Observable<IUser> = this.authService.currentUser$;

  refresh$ = new BehaviorSubject(undefined);


  private postAddedSubscription: Subscription;


  constructor(
    private postService: PostService,
    private authService: AuthService,
    private iconService: IconService) {
    this.icons = this.iconService.getIcons();
  }



  ngOnInit(): void {

    this.postAddedSubscription = this.postService.postAdded.subscribe(() => {
      this.loadPostList();
    });
    this.refresh$.subscribe(() => {
      this.loadPostList();
    });
  }


  loadPostList(): void {
    this.postService.loadPostList$(this.eventId, 5).subscribe(postList => {
      this.postList = postList;
      this.checkIsUserLiked(this.postList);

    });
  }
  checkIsUserLiked(postList: IPost[]): void {
    // check if current user is liked or unliked some post
    this.authService.currentUser$.pipe(
      map(user => user?._id)
    ).subscribe(curruserId => {
      postList.forEach(post => {
        post.userLiked = post.likes.includes(curruserId);
        post.userUnliked = post.unlikes.includes(curruserId);
      });
    });
  }

  canLike(comment: IPost): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map(user => user && user._id !== comment.userId._id),
      // take(1) // get only first value of observable
    );
  }


  toggleLikes(comment: IPost): void {
     this.authService.currentUser$.pipe(
      map(user => user?._id),
      take(1),
    ).subscribe(curruserId => {
     if (comment.unlikes.includes(curruserId)) {
      this.postService.removeUnlikePost$(comment._id)
      .subscribe(() => this.refresh$.next(undefined));
     }
        if (!comment.likes.includes(curruserId)) {
             
          this.postService.likePost$(comment._id)
          .subscribe(() => {
            console.log('call ADDLIKE', curruserId);
            this.refresh$.next(undefined);
          });
        } else {
          this.postService.dislikePost$(comment._id)
         .subscribe(() => {
            console.log('call REMOVELIKE', curruserId);

            this.refresh$.next(undefined);
          });
        }
    });
  }

  toggleUnlikes(comment: IPost): void {
    this.authService.currentUser$.pipe(
      map(user => user?._id),
      take(1),
    ).subscribe(curruserId => {
      if (comment.likes.includes(curruserId)) {
        this.postService.dislikePost$(comment._id)
        .subscribe(() => this.refresh$.next(undefined));
      }
        if (!comment.unlikes.includes(curruserId)) {
          console.log('call Unlike', curruserId);
          console.log('comment creator', comment);
            this.postService.unlikePost$(comment._id)
         .subscribe(() => this.refresh$.next(undefined));
        } else {
          console.log('call removeUnlike', curruserId);
          this.postService.removeUnlikePost$(comment._id)
          .subscribe(() => this.refresh$.next(undefined));
        }

    });
  }

  ngOnDestroy(): void {
     this.postAddedSubscription?.unsubscribe();
  }
}
