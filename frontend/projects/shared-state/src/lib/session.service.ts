import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import type { CurrentUser } from './session.types';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly http = inject(HttpClient);
  readonly user = signal<CurrentUser | null>(null);
  private loadRequest?: Subscription;

  setUser(user: CurrentUser) {
    this.loadRequest?.unsubscribe();
    this.user.set(user);
  }

  logout() {
    return this.http.post<{
      data?: { logout: boolean } | null;
      errors?: Array<{ message: string }>;
    }>('http://localhost:8080/graphql', {
      query: 'mutation Logout { logout }',
    }, { withCredentials: true });
  }

  clear() {
    this.loadRequest?.unsubscribe();
    this.user.set(null);
  }

  load() {
    this.loadRequest?.unsubscribe();
    this.loadRequest = this.http.post<{
      data?: { me: CurrentUser | null } | null;
      errors?: Array<{ message: string }>;
    }>('http://localhost:8080/graphql', {
      query: 'query CurrentUser { me { id name username role } }',
    }, { withCredentials: true }).subscribe({
      next: (result) => this.user.set(result.errors?.length ? null : result.data?.me ?? null),
      error: () => this.user.set(null),
    });
  }
}
