import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the username returned by me', () => {
    component.session.load();
    const http = TestBed.inject(HttpTestingController);
    const request = http.expectOne('http://localhost:8080/graphql');
    expect(request.request.withCredentials).toBe(true);
    request.flush({ data: { me: { id: '1', name: 'Arnab', username: 'arnab', role: 'USER' } } });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.username').textContent).toBe('arnab');
    http.verify();
  });

  it('hides the username when me returns null', () => {
    component.session.load();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('http://localhost:8080/graphql').flush({ data: { me: null } });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.username')).toBeNull();
    http.verify();
  });

  it('logs out with credentials and hides the current user', () => {
    const http = TestBed.inject(HttpTestingController);
    component.session.load();
    http.expectOne('http://localhost:8080/graphql').flush({
      data: { me: { id: '1', name: 'Arnab', username: 'arnab', role: 'USER' } },
    });
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();

    const request = http.expectOne('http://localhost:8080/graphql');
    expect(request.request.withCredentials).toBe(true);
    expect(request.request.body.query).toBe('mutation Logout { logout }');
    request.flush({ data: { logout: true } });
    fixture.detectChanges();

    expect(component.session.user()).toBeNull();
    expect(fixture.nativeElement.querySelector('.username')).toBeNull();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
    http.verify();
  });
});
