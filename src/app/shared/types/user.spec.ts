

import { UserInterface } from './userInterface';

describe('User', () => {
  it('should create an instance', () => {
    // Create an object that matches the User interface
    const user: UserInterface = {

      email: 'test@example.com'
    };

    expect(user).toBeTruthy();
  });
});
