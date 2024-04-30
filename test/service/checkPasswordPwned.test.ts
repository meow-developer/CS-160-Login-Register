import CheckPasswordPwned from '../../service/checkPasswordPwned.js';

describe('CheckPasswordPwned', () => {
  let checkPasswordPwned: CheckPasswordPwned;

  beforeEach(() => {
    checkPasswordPwned = new CheckPasswordPwned();
  });

  it('should return true if password is pwned', async () => {
    const isPwned = await checkPasswordPwned.verifyPasswordSafety('password123');
    expect(isPwned).toBe(true);
  });

  it('should return false if password is not pwned', async () => {
    const isPwned = await checkPasswordPwned.verifyPasswordSafety('secure@password');
    expect(isPwned).toBe(false);
  });

});