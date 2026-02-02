import { chromium } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

async function globalSetup() {
  const prisma = new PrismaClient();

  // Check if test user exists
  let user = await prisma.user.findUnique({
    where: { email: 'test@example.com' },
  });

  if (!user) {
    // Create test user
    const hashed = await bcrypt.hash('password123', 10);
    user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashed,
        role: 'USER',
      },
    });
  }

  await prisma.$disconnect();

  // Perform authentication and save state
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('http://localhost:3000/');

  // Save auth state
  await page.context().storageState({ path: 'playwright/.auth/user.json' });

  await browser.close();
}

export default globalSetup;