import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-hamburger-menu',
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.css'],
})
export class HamburgerMenuComponent {
  @Output() toggleMenu = new EventEmitter<void>();

  onToggleMenu(): void {
    this.toggleMenu.emit();
  }
}
