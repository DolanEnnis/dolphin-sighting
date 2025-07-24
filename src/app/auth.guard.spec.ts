import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from './shared/services/auth.service';
import { signal, WritableSignal } from '@angular/core';
import { User } from '@angular/fire/auth';

// Create a mock for the AuthService to control its behavior in tests.
class MockAuthService {
  // Use a WritableSignal to easily change the user state for different tests.
  currentUserSig: WritableSignal<User | null | undefined> = signal(undefined);
}

// Create a mock for the Router to spy on navigation calls.
class MockRouter {
  navigate(commands: any[]): Promise<boolean> {
    return Promise.resolve(true);
  }
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: MockAuthService;
  let router: MockRouter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Provide the real guard and its mocked dependencies.
      providers: [
        AuthGuard,
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
      ],
    });

    // Inject the guard and the mocked services from the testing module.
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router) as unknown as MockRouter;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if user is logged in', async () => {
    // Arrange: Set the user signal to a logged-in state.
    authService.currentUserSig.set({ uid: 'test-uid' } as User);

    // Act: Call the canActivate method.
    const canActivate = await guard.canActivate();

    // Assert: Expect it to return true, allowing access.
    expect(canActivate).toBe(true);
  });

  it('should block activation and navigate to login if user is not logged in', async () => {
    // Arrange: Set the user signal to a logged-out state (null).
    authService.currentUserSig.set(null);
    // Spy on the router's navigate method to ensure it's called.
    const navigateSpy = spyOn(router, 'navigate').and.callThrough();

    // Act: Call the canActivate method.
    const canActivate = await guard.canActivate();

    // Assert: Expect it to return false and to have redirected to the login page.
    expect(canActivate).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
