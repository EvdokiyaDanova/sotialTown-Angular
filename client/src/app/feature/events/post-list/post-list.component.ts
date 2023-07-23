import { Component, Input, OnInit } from '@angular/core';
import { IPost, IUser } from '../../../core/interfaces';
import { PostService } from '../../../core/post.service';
//import { AuthService } from 'src/app/auth.service';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
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


  private postAddedSubscription: Subscription;
  private likeSubscription: Subscription;
  private unlikeSubscription: Subscription;
  private canLikeSubscription: Subscription;

  constructor(private postService: PostService,
    private authService: AuthService,
    private iconService: IconService) { 
      this.icons = this.iconService.getIcons();
    }



  ngOnInit(): void {
    // this.loadPostList();
  
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
      // this.checkIsUserLiked(this.postList);
      // console.log(this.postList);
      
    });
  }
  // checkIsUserLiked(postList: IPost[]): void {
  //   // check if current user is liked or unliked some post
  //   this.authService.currentUser$.pipe(
  //     map(user => user?._id)
  //   ).subscribe(curruserId => {
  //     postList.forEach(post => {
  //       post.userLiked = post.likes.includes(curruserId);
  //       post.userUnliked = post.unlikes.includes(curruserId);
  //     });
  //   });
  // }

  canLike(comment: IPost): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map(user => user && user._id !== comment.userId._id),
     // take(1) // Взема само 1 стойност и автоматично се отписва
    );
    // return this.authService.currentUser$.pipe(
    //   //  tap(user => console.log('canLike result:', user && user._id !== comment.userId._id)),
    //   map(user => user && user._id !== comment.userId._id)
    // );
  }
 
//todo ERROR to fix - when user2 create comment in event from user1 and logout
//=> console print error for Unauthorized http://localhost:3000/api/likes/64bd3c0500829d7034658314 request
// and when login again you see taht user1 "id" is added in "likes" && "unlikes" on comment from user1
 
  // toggleLikes(comment: IPost): void {
  //  // console.log(comment);
  //   this.likeSubscription =  this.authService.currentUser$.pipe(
  //     map(user => user?._id)
  //   ).subscribe(curruserId => {
  //     if (!comment.unlikes.includes(curruserId)) {
  //       if (!comment.likes.includes(curruserId)) {
  //         console.log('call ADDLIKE', curruserId);
  //         this.postService.likePost$(comment._id).subscribe(() => {
  //           this.refresh$.next(undefined);
  //         });
  //       } else {
  //         console.log('call REMOVELIKE', curruserId);
  //         this.postService.dislikePost$(comment._id).subscribe(() => {
  //           this.refresh$.next(undefined);
  //         });
  //       }
  //     }
  //   });
  // }

  // toggleUnlikes(comment: IPost): void {
  //   this.unlikeSubscription = this.authService.currentUser$.pipe(
  //     map(user => user?._id)
  //   ).subscribe(curruserId => {
  //     if (!comment.likes.includes(curruserId)) {
  //       if (!comment.unlikes.includes(curruserId)) {
  //         console.log('call Unlike', curruserId);
  //         console.log('comment creator', comment);
  //         this.postService.unlikePost$(comment._id).subscribe(() => this.refresh$.next(undefined));
  //       } else {
  //         console.log('call removeUnlike', curruserId);
  //         this.postService.removeUnlikePost$(comment._id).subscribe(() => this.refresh$.next(undefined));
  //       }
  //     }

  //   });
  // }
  toggleLikes(comment: IPost): void {
    // Проверка дали потребителят е логнат преди да абонираме за canLike
    if (this.authService.isLoggedIn$) {
      this.canLikeSubscription = this.canLike(comment).subscribe(canLikeResult => {
        if (canLikeResult) {
          // Абонираме се за текущия потребител и извършваме лайк/дизлайк
          this.authService.currentUser$.pipe(
            map(user => user?._id),
            take(1)
          ).subscribe(currUserId => {
            if (!comment.unlikes.includes(currUserId)) {
              if (!comment.likes.includes(currUserId)) {
                console.log('call ADDLIKE', currUserId);
                this.postService.likePost$(comment._id).subscribe(() => {
                  this.refresh$.next(undefined);
                });
              } else {
                console.log('call REMOVELIKE', currUserId);
                this.postService.dislikePost$(comment._id).subscribe(() => {
                  this.refresh$.next(undefined);
                });
              }
            }
          });
        }
      });
    }
  }

  toggleUnlikes(comment: IPost): void {
    // Проверка дали потребителят е логнат преди да абонираме за canLike
    if (this.authService.isLoggedIn$) {
      this.canLikeSubscription = this.canLike(comment).subscribe(canLikeResult => {
        if (canLikeResult) {
          // Абонираме се за текущия потребител и извършваме дизлайк/премахване на дизлайк
          this.authService.currentUser$.pipe(
            map(user => user?._id),
            take(1)
          ).subscribe(currUserId => {
            if (!comment.likes.includes(currUserId)) {
              if (!comment.unlikes.includes(currUserId)) {
                console.log('call Unlike', currUserId);
                this.postService.unlikePost$(comment._id).subscribe(() => this.refresh$.next(undefined));
              } else {
                console.log('call removeUnlike', currUserId);
                this.postService.removeUnlikePost$(comment._id).subscribe(() => this.refresh$.next(undefined));
              }
            }
          });
        }
      });
    }
  }

    

  ngOnDestroy(): void {
    this.postAddedSubscription.unsubscribe();
    if (this.likeSubscription) {
      this.likeSubscription.unsubscribe();
    }
    if (this.unlikeSubscription) {
      this.unlikeSubscription.unsubscribe();
    }
    // Отписване и от canLikeSubscription при унищожаване на компонента
    if (this.canLikeSubscription) {
      this.canLikeSubscription.unsubscribe();
    }
    
  }
}
