import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '@app/shared-state';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly session = inject(SessionService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
  });
  readonly submitting = signal(false);
  readonly loginMessage = signal('');

  onLogin() {
    if (this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.loginMessage.set('');
    this.authService.login(this.loginForm.getRawValue()).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (result) => {
        this.submitting.set(false);
        if (result.errors?.length || !result.data?.login) {
          this.loginMessage.set('Unable to log in. Please try again.');
          return;
        }
        this.loginMessage.set(result.data.login.message);
        if (result.data.login.success && result.data.login.user) {
          // Native Federation shares this service with the shell and its header.
          this.session.setUser(result.data.login.user);
          this.session.load();
        }
      },
      error: () => {
        this.submitting.set(false);
        this.loginMessage.set('Unable to log in. Please try again.');
      },
    });
  }
}
