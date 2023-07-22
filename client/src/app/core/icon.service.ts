// icon.service.ts
import { Injectable } from '@angular/core';
import { library, IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faHeart, faLock, faUser, faPhone, faThumbsUp,faThumbsDown} from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  constructor() {
    this.loadIcons();
  }

  private loadIcons(): void {
    // imports icons in library
    library.add(faEnvelope, faHeart,faLock,faUser,faPhone,faThumbsUp,faThumbsDown );
  }

  getIcons(): { [key: string]: IconDefinition } {
    return {
        emailIcon: faEnvelope,
        favoriteIcon: faHeart,
        passwordIcon: faLock,
        userIcon:faUser,
        phoneIcon:faPhone,
        likeIcon:faThumbsUp,
        unlikeIcon:faThumbsDown ,
    };
  }
}
