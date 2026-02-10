import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteRecipeButton from '@/components/DeleteRecipeButton';
import { prisma } from '../../jest.setup';

// Mock Next.js router
const mockPush = jest.fn();
const mockRefresh = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

// Mock window.confirm
const mockConfirm = jest.fn();
global.confirm = mockConfirm;

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock alert
const mockAlert = jest.fn();
global.alert = mockAlert;

describe('DeleteRecipeButton', () => {
  let testUser: any;
  let testRecipe: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    // Create a test user for each test
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword',
        role: 'USER',
      },
    });
    // Create a test recipe for each test
    testRecipe = await prisma.recipe.create({
      data: {
        title: 'Test Recipe',
        ingredients: '2 cups flour\n1 cup sugar\n2 eggs',
        steps: '1. Mix ingredients\n2. Bake for 30 minutes',
        imageUrl: 'https://example.com/recipe.jpg',
        userId: testUser.id,
      },
    });
  });

  afterEach(async () => {
    // Clean up recipes and users
    await prisma.recipe.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should delete the recipe created in add.test.tsx', async () => {
    const user = userEvent.setup();

    // The recipe is created in beforeEach, simulating add.test.tsx creation

    // Now test the delete functionality
    mockConfirm.mockReturnValue(true); // User confirms deletion

    // Mock the DELETE request
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ok: true }),
      })
    );

    render(<DeleteRecipeButton recipeId={testRecipe.id} />);

    const deleteButton = screen.getByRole('button', { name: /izbriši/i });
    expect(deleteButton).toBeInTheDocument();

    await user.click(deleteButton);

    // Check that confirm was called
    expect(mockConfirm).toHaveBeenCalledWith('Ste prepričani, da želite izbrisati recept?');

    // Wait for the fetch call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(`/api/recipes/${testRecipe.id}`, {
        method: 'DELETE',
      });
    });

    // Check that router.push and router.refresh were called
    expect(mockPush).toHaveBeenCalledWith('/profile');
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('should not delete if user cancels confirmation', async () => {
    const user = userEvent.setup();

    mockConfirm.mockReturnValue(false); // User cancels

    render(<DeleteRecipeButton recipeId={testRecipe.id} />);

    const deleteButton = screen.getByRole('button', { name: /izbriši/i });
    await user.click(deleteButton);

    expect(mockConfirm).toHaveBeenCalledWith('Ste prepričani, da želite izbrisati recept?');

    // Fetch should not be called
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should handle delete error', async () => {
    const user = userEvent.setup();

    mockConfirm.mockReturnValue(true);

    // Mock failed DELETE request
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Napaka pri brisanju.' }),
      })
    );

    render(<DeleteRecipeButton recipeId={testRecipe.id} />);

    const deleteButton = screen.getByRole('button', { name: /izbriši/i });
    await user.click(deleteButton);

    // Wait for the fetch call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(`/api/recipes/${testRecipe.id}`, {
        method: 'DELETE',
      });
    });

    // Router should not be called
    expect(mockPush).not.toHaveBeenCalled();
  });
});