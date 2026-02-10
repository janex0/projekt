require('dotenv').config({ path: '.env' })

import '@testing-library/jest-dom'

// Provide global setImmediate for Prisma
global.setImmediate = global.setImmediate || function(fn) {
  return setTimeout(fn, 0);
};

// Provide global Request and Response objects for Node environment
if (!globalThis.Request) {
  globalThis.Request = class Request {
    constructor(url, options) {
      this.url = url
      this.options = options
      this.body = options?.body
    }
    async json() {
      try {
        return JSON.parse(this.body)
      } catch {
        return {}
      }
    }
  }
}

if (!globalThis.Response) {
  globalThis.Response = class Response {
    constructor(body, options = {}) {
      this.body = body
      this.status = options.status || 200
      this.headers = options.headers || {}
    }
    async json() {
      try {
        return JSON.parse(this.body)
      } catch {
        return {}
      }
    }
  }
}

// Mock next/router for older React components if needed
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: {},
    pathname: '/',
  }),
}))

// Mock next/navigation for new React Server Components
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Setup for integration tests with database
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

beforeAll(async () => {
  // Connect to test database
  await prisma.$connect()
})

afterAll(async () => {
  // Disconnect from test database
  await prisma.$disconnect()
})

beforeEach(async () => {
  // Clean up database before each test
  await prisma.recipe.deleteMany()
  await prisma.user.deleteMany()
})
