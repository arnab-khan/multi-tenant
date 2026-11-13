import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { catchError, EMPTY, switchMap, timer } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-signup',
  styleUrl: './signup.scss',
  templateUrl: './signup.html',
})
export class Signup {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly signupForm = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    username: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
  });

  readonly usernameMessage = signal('');
  readonly signupMessage = signal('');
  readonly submitting = signal(false);

  constructor() {
    this.signupForm.controls.username.valueChanges.pipe(
      switchMap((username) => {
        this.usernameMessage.set(username ? 'Checking username...' : '');
        if (!username) {
          return EMPTY;
        }

        return timer(300).pipe(
          switchMap(() => this.authService.usernameExists(username)),
          catchError(() => {
            this.usernameMessage.set('Unable to check username. Please try again.');
            return EMPTY;
          }),
        );
      }),
      takeUntilDestroyed(),
    ).subscribe((result) => {
      const exists = result.data?.usernameExists?.exists;
      if (result.errors?.length || typeof exists !== 'boolean') {
        this.usernameMessage.set('Unable to check username. Please try again.');
        return;
      }

      this.usernameMessage.set(exists ? 'Username is already taken.' : 'Username is available.');
    });
  }

  onSignup() {
    if (this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.signupMessage.set('');
    this.authService.addUser(this.signupForm.getRawValue()).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (result) => {
        this.submitting.set(false);
        if (result.errors?.length || !result.data?.addUser) {
          this.signupMessage.set(result.errors?.[0]?.message ?? 'Unable to create account. Please try again.');
          return;
        }

        this.signupMessage.set('Account created successfully.');
      },
      error: () => {
        this.submitting.set(false);
        this.signupMessage.set('Unable to create account. Please try again.');
      },
    });
  }
}
