import { Component, Input, OnInit } from '@angular/core';
import { IPost, IUser } from '../../../core/interfaces';
import { PostService } from '../../../core/post.service';
//import { AuthService } from 'src/app/auth.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import { IconService } from 'src/app/core/icon.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  icons: { [key: string]: any };
  now = new Date();

  @Input() eventId: string;

  postList: IPost[];
  isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$;
  currentUser$: Observable<IUser> = this.authService.currentUser$;

  refresh$ = new BehaviorSubject(undefined);
  isLiked: boolean = false;
  isUnliked: boolean = false;

  private postAddedSubscription: Subscription;
  constructor(private postService: PostService,
    private authService: AuthService,
    private iconService: IconService) { 
      this.icons = this.iconService.getIcons();
    }



  ngOnInit(): void {
    this.loadPostList();

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
    });
  }


  canLike(comment: IPost): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      //  tap(user => console.log('canLike result:', user && user._id !== comment.userId._id)),
      map(user => user && user._id !== comment.userId._id)
    );
  }

 
  toggleLikes(comment: IPost): void {
    this.authService.currentUser$.pipe(
      map(user => user?._id)
    ).subscribe(userId => {
      if (!comment.unlikes.includes(userId)) {
        if (!comment.likes.includes(userId)) {
          this.isLiked = true;
          console.log('call ADDLIKE');
          this.postService.likePost(comment._id).subscribe(() => {
            this.refresh$.next(undefined);
          });
        } else {
          this.isLiked = false;
          console.log('call REMOVELIKE');
          this.postService.dislikePost(comment._id).subscribe(() => {
            this.refresh$.next(undefined);
          });
        }
      }
    });
  }

  toggleUnlikes(comment: IPost): void {
    this.authService.currentUser$.pipe(
      map(user => user?._id)
    ).subscribe(userId => {
      if (!comment.likes.includes(userId)) {
        if (!comment.unlikes.includes(userId)) {
          this.isUnliked = true;
          console.log('call Unlike');
          this.postService.unlikePost(comment._id).subscribe(() => this.refresh$.next(undefined));
        } else {
          this.isUnliked = false;
          console.log('call removeUnlike');
          this.postService.removeUnlikePost(comment._id).subscribe(() => this.refresh$.next(undefined));
        }
      }

    });
  }



  ngOnDestroy(): void {
    this.postAddedSubscription.unsubscribe();
  }
}
