import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UIService } from './ui.service';

// Create a mock for MatSnackBar to isolate the test from the actual component.
// This satisfies the dependency injection system without needing a real MatSnackBar.
class MockMatSnackBar {
  open(message: string, action: string, config?: any) {
    // This is a mock implementation. We can spy on it to verify calls.
  }
}

describe('UiService', () => {
  let service: UIService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Provide the service under test and its mocked dependencies.
      providers: [
        UIService,
        { provide: MatSnackBar, useClass: MockMatSnackBar }
      ]
    });
    // Inject the service and its dependencies from the testing module.
    service = TestBed.inject(UIService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // It's good practice to test the public methods of the service.
  it('should call MatSnackBar.open when showSnackbar is called', () => {
    // Arrange: Create a spy on the mock snackbar's 'open' method.
    const snackbarSpy = spyOn(snackBar, 'open').and.callThrough();
    const testMessage = 'Test message';
    const testAction = 'OK';
    const testDuration = 5000;

    // Act: Call the method we want to test.
    service.showSnackbar(testMessage, testAction, testDuration);

    // Assert: Verify that the spy was called with the correct arguments.
    expect(snackbarSpy).toHaveBeenCalledWith(testMessage, testAction, { duration: testDuration });
  });
});
