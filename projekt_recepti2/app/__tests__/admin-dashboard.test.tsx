import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DashboardPage from '@/app/admin/dashboard/page';

// Mock Prisma
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => ({
      user: { 
        count: jest.fn().mockImplementation((options?: any) => {
          if (options?.where?.role === 'ADMIN') {
            return Promise.resolve(1); // 1 admin
          }
          return Promise.resolve(3); // 3 total users
        })
      },
      recipe: { 
        count: jest.fn().mockResolvedValue(3),
        findFirst: jest.fn().mockResolvedValue({
          id: '1',
          title: 'Last Recipe',
          user: { name: 'Test User' },
        })
      }
    }))
  };
});

describe('Admin Dashboard', () => {
  it('should display correct statistics for admin user', async () => {
    // Render the dashboard
    const component = await DashboardPage();
    render(component);

    // Check statistics - there are 2 elements with '3' (users and recipes)
    expect(screen.getAllByText('3')).toHaveLength(2);
    expect(screen.getByText('1')).toBeInTheDocument(); // Total admins: 1

    // Check titles
    expect(screen.getByText('Uporabniki')).toBeInTheDocument();
    expect(screen.getByText('Recepti')).toBeInTheDocument();
    expect(screen.getByText('Admini')).toBeInTheDocument();

    // Check that the admin email is mentioned (though not directly, but in mock)
    // Since we mocked the stats, we assume the admin user exists
  });
});