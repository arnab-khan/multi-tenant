import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SessionService } from '@app/shared-state';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates the shared session directly after successful login', () => {
    const http = TestBed.inject(HttpTestingController);
    const session = TestBed.inject(SessionService);
    const user = { id: '1', name: 'Arnab', username: 'arnab', role: 'USER' };
    component.loginForm.setValue({ username: 'arnab', password: 'test-password' });

    component.onLogin();
    http.expectOne('http://localhost:8080/graphql').flush({
      data: { login: { success: true, message: 'Login successful', user } },
    });

    expect(session.user()).toEqual(user);
    const me = http.expectOne('http://localhost:8080/graphql');
    expect(me.request.withCredentials).toBe(true);
    me.flush({ data: { me: user } });
    expect(session.user()).toEqual(user);
    http.verify();
  });

  it('should submit credentials and display the login result', () => {
    component.loginForm.setValue({ username: 'arnab', password: 'test-password' });
    component.onLogin();

    const http = TestBed.inject(HttpTestingController);
    const request = http.expectOne('http://localhost:8080/graphql');
    expect(request.request.method).toBe('POST');
    expect(request.request.withCredentials).toBe(true);
    expect(request.request.body.operationName).toBe('Login');
    expect(request.request.body.variables.input).toEqual({ username: 'arnab', password: 'test-password' });
    expect(component.submitting()).toBe(true);

    request.flush({ data: { login: { success: false, message: 'Invalid username or password', user: null } } });

    expect(component.loginMessage()).toBe('Invalid username or password');
    expect(component.submitting()).toBe(false);
    http.verify();
  });
});
