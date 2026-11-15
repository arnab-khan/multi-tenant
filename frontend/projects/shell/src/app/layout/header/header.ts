import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SessionService } from '@app/shared-state';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  readonly session = inject(SessionService);
  private readonly destroyRef = inject(DestroyRef);
  readonly loggingOut = signal(false);
  readonly logoutMessage = signal('');

  logout() {
    if (this.loggingOut()) {
      return;
    }
    this.loggingOut.set(true);
    this.logoutMessage.set('');
    this.session.logout().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        this.loggingOut.set(false);
        if (result.errors?.length || result.data?.logout !== true) {
          this.logoutMessage.set('Unable to log out. Please try again.');
          return;
        }
        this.session.clear();
      },
      error: () => {
        this.loggingOut.set(false);
        this.logoutMessage.set('Unable to log out. Please try again.');
      },
    });
  }
}
