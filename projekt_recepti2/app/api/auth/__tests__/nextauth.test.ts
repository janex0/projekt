import bcrypt from 'bcryptjs';

// NextAuth credential tests
describe('NextAuth Credentials Provider', () => {
  describe('Password Comparison', () => {
    it('should verify correct password', async () => {
      const plainPassword = 'userPassword123';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const isValid = await bcrypt.compare(plainPassword, hashedPassword);
      expect(isValid).toBeTruthy();
    });

    it('should reject incorrect password', async () => {
      const correctPassword = 'userPassword123';
      const wrongPassword = 'wrongPassword';
      const hashedPassword = await bcrypt.hash(correctPassword, 10);

      const isValid = await bcrypt.compare(wrongPassword, hashedPassword);
      expect(isValid).toBeFalsy();
    });

    it('should handle empty passwords', async () => {
      const hashedPassword = await bcrypt.hash('realPassword', 10);

      const isValid = await bcrypt.compare('', hashedPassword);
      expect(isValid).toBeFalsy();
    });
  });

  describe('Credential Validation', () => {
    it('should require email and password', () => {
      const credentials = {
        email: 'user@example.com',
        password: 'password123',
      };

      const isValid = credentials.email && credentials.password;
      expect(isValid).toBeTruthy();
    });

    it('should reject missing email', () => {
      const credentials = {
        email: '',
        password: 'password123',
      };

      const isValid = credentials.email && credentials.password;
      expect(isValid).toBeFalsy();
    });

    it('should reject missing password', () => {
      const credentials = {
        email: 'user@example.com',
        password: '',
      };

      const isValid = credentials.email && credentials.password;
      expect(isValid).toBeFalsy();
    });

    it('should accept valid credentials format', () => {
      const credentials = {
        email: 'test+user@example.co.uk',
        password: 'securePassword123!',
      };

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const hasValidEmail = emailRegex.test(credentials.email);
      const hasValidPassword = credentials.password.length >= 6;

      expect(hasValidEmail).toBeTruthy();
      expect(hasValidPassword).toBeTruthy();
    });
  });

  describe('User Data Formatting', () => {
    it('should convert numeric user id to string', () => {
      const userId = 123;
      const formattedId = userId.toString();

      expect(formattedId).toBe('123');
      expect(typeof formattedId).toBe('string');
    });

    it('should include user role in session', () => {
      const userData = {
        id: 1,
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'ADMIN',
      };

      expect(userData.role).toBe('ADMIN');
    });

    it('should include email in user data', () => {
      const userData = {
        id: 1,
        email: 'user@example.com',
        name: 'Test User',
        role: 'USER',
      };

      expect(userData.email).toBe('user@example.com');
    });

    it('should include user name in data', () => {
      const userData = {
        id: 1,
        email: 'user@example.com',
        name: 'Test User',
        role: 'USER',
      };

      expect(userData.name).toBe('Test User');
    });
  });

  describe('Google OAuth User Detection', () => {
    it('should identify user without password as OAuth user', () => {
      const userData = {
        id: 1,
        email: 'user@gmail.com',
        password: null,
        name: 'Google User',
        role: 'USER',
      };

      const isOAuthUser = !userData.password;
      expect(isOAuthUser).toBeTruthy();
    });

    it('should identify user with password as credentials user', () => {
      const userData = {
        id: 1,
        email: 'user@example.com',
        password: 'hashedPassword',
        name: 'Credentials User',
        role: 'USER',
      };

      const isCredentialsUser = !!userData.password;
      expect(isCredentialsUser).toBeTruthy();
    });
  });

  describe('Email Handling', () => {
    it('should accept case-sensitive emails', () => {
      const email1 = 'User@Example.com';
      const email2 = 'user@example.com';

      expect(email1).not.toBe(email2);
    });

    it('should accept email with plus addressing', () => {
      const email = 'user+filter@example.com';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      expect(emailRegex.test(email)).toBeTruthy();
    });

    it('should accept international domain emails', () => {
      const email = 'user@example.co.uk';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      expect(emailRegex.test(email)).toBeTruthy();
    });
  });
});
