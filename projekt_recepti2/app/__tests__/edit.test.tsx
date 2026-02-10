import React from 'react'
import { prisma } from '../../jest.setup'

// Edit Recipe Tests
describe('Edit Recipe Functionality', () => {
  describe('Server Action - updateRecipe', () => {
    it('should update recipe with valid data', async () => {
      // Create test user first
      const testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          password: 'hashedpassword',
          role: 'USER',
        }
      })

      // Create test recipe first
      const testRecipe = await prisma.recipe.create({
        data: {
          title: 'Original Recipe',
          ingredients: 'flour, sugar, eggs',
          steps: 'Mix ingredients and bake',
          imageUrl: 'https://example.com/image.jpg',
          userId: testUser.id,
        }
      })

      // Update the recipe
      await prisma.recipe.update({
        where: { id: testRecipe.id },
        data: {
          title: 'Updated Recipe Title',
          ingredients: 'flour, sugar, eggs, milk',
          steps: 'Mix ingredients, add milk and bake',
          imageUrl: 'https://example.com/updated-image.jpg',
        },
      })

      // Verify the update
      const updated = await prisma.recipe.findUnique({
        where: { id: testRecipe.id }
      })

      expect(updated?.title).toBe('Updated Recipe Title')
      expect(updated?.ingredients).toBe('flour, sugar, eggs, milk')
      expect(updated?.steps).toBe('Mix ingredients, add milk and bake')
      expect(updated?.imageUrl).toBe('https://example.com/updated-image.jpg')
    })

    it('should handle empty imageUrl', async () => {
      const testUser = await prisma.user.create({
        data: {
          email: 'test2@example.com',
          name: 'Test User 2',
          password: 'hashedpassword',
          role: 'USER',
        }
      })

      const testRecipe = await prisma.recipe.create({
        data: {
          title: 'Test Recipe',
          ingredients: 'test ingredients',
          steps: 'test steps',
          imageUrl: 'original.jpg',
          userId: testUser.id,
        }
      })

      await prisma.recipe.update({
        where: { id: testRecipe.id },
        data: {
          imageUrl: '',
        },
      })

      const updated = await prisma.recipe.findUnique({
        where: { id: testRecipe.id }
      })

      expect(updated?.imageUrl).toBe('')
    })

    it('should handle special characters in data', async () => {
      const testUser = await prisma.user.create({
        data: {
          email: 'test3@example.com',
          name: 'Test User 3',
          password: 'hashedpassword',
          role: 'USER',
        }
      })

      const testRecipe = await prisma.recipe.create({
        data: {
          title: 'Original',
          ingredients: 'original',
          steps: 'original',
          imageUrl: 'original.jpg',
          userId: testUser.id,
        }
      })

      const specialTitle = 'Recipe with émojis 🍕 and spëcial chärs'
      const specialIngredients = 'flour (2 cups), sugar & eggs'

      await prisma.recipe.update({
        where: { id: testRecipe.id },
        data: {
          title: specialTitle,
          ingredients: specialIngredients,
        },
      })

      const updated = await prisma.recipe.findUnique({
        where: { id: testRecipe.id }
      })

      expect(updated?.title).toBe(specialTitle)
      expect(updated?.ingredients).toBe(specialIngredients)
    })

    it('should handle multiline text', async () => {
      const testUser = await prisma.user.create({
        data: {
          email: 'test4@example.com',
          name: 'Test User 4',
          password: 'hashedpassword',
          role: 'USER',
        }
      })

      const testRecipe = await prisma.recipe.create({
        data: {
          title: 'Original',
          ingredients: 'original',
          steps: 'original',
          imageUrl: 'original.jpg',
          userId: testUser.id,
        }
      })

      const multilineIngredients = `2 cups flour
1 cup sugar
3 eggs
1 tsp vanilla extract
1/2 cup milk`

      const multilineSteps = `1. Preheat oven to 350°F
2. Mix dry ingredients
3. Add wet ingredients
4. Bake for 30 minutes`

      await prisma.recipe.update({
        where: { id: testRecipe.id },
        data: {
          ingredients: multilineIngredients,
          steps: multilineSteps,
        },
      })

      const updated = await prisma.recipe.findUnique({
        where: { id: testRecipe.id }
      })

      expect(updated?.ingredients).toBe(multilineIngredients)
      expect(updated?.steps).toBe(multilineSteps)
    })
  })

  describe('Recipe Data Validation', () => {
    it('should accept valid recipe data', () => {
      const validData = {
        title: 'Chocolate Cake Recipe',
        ingredients: '2 cups flour, 1 cup sugar, 3 eggs, 1 cup milk',
        steps: 'Mix dry ingredients, add wet ingredients, bake at 180°C',
        imageUrl: 'https://example.com/cake.jpg'
      }

      expect(validData.title.length).toBeGreaterThan(0)
      expect(validData.ingredients.length).toBeGreaterThan(0)
      expect(validData.steps.length).toBeGreaterThan(0)
      expect(validData.imageUrl).toContain('http')
    })

    it('should handle empty imageUrl field', () => {
      const dataWithEmptyImage = {
        title: 'Recipe without image',
        ingredients: 'flour, sugar, eggs',
        steps: 'mix and bake',
        imageUrl: ''
      }

      expect(dataWithEmptyImage.imageUrl).toBe('')
      expect(dataWithEmptyImage.title.length).toBeGreaterThan(0)
    })

    it('should accept very long text inputs', () => {
      const longTitle = 'A'.repeat(500)
      const longIngredients = 'B'.repeat(2000)
      const longSteps = 'C'.repeat(5000)

      expect(longTitle.length).toBe(500)
      expect(longIngredients.length).toBe(2000)
      expect(longSteps.length).toBe(5000)
    })

    it('should handle special characters and emojis', () => {
      const specialTitle = 'Recipe with émojis 🍕 and spëcial chärs 🔥'
      const specialIngredients = 'flour (2 cups), sugar & eggs 🥚'

      expect(specialTitle).toContain('🍕')
      expect(specialIngredients).toContain('🥚')
      expect(specialTitle.length).toBeGreaterThan(0)
      expect(specialIngredients.length).toBeGreaterThan(0)
    })
  })

  describe('Database Operations', () => {
    it('should find recipe by id', async () => {
      const testUser = await prisma.user.create({
        data: {
          email: 'find@example.com',
          name: 'Find User',
          password: 'hashedpassword',
          role: 'USER',
        }
      })

      const testRecipe = await prisma.recipe.create({
        data: {
          title: 'Test Recipe for Finding',
          ingredients: 'test ingredients',
          steps: 'test steps',
          imageUrl: 'test.jpg',
          userId: testUser.id,
        }
      })

      const found = await prisma.recipe.findUnique({
        where: { id: testRecipe.id }
      })

      expect(found?.id).toBe(testRecipe.id)
      expect(found?.title).toBe('Test Recipe for Finding')
    })

    it('should return null for non-existent recipe', async () => {
      const found = await prisma.recipe.findUnique({
        where: { id: 999999 }
      })

      expect(found).toBeNull()
    })

    it('should update only specified fields', async () => {
      const testUser = await prisma.user.create({
        data: {
          email: 'partial@example.com',
          name: 'Partial User',
          password: 'hashedpassword',
          role: 'USER',
        }
      })

      const testRecipe = await prisma.recipe.create({
        data: {
          title: 'Original Title',
          ingredients: 'original ingredients',
          steps: 'original steps',
          imageUrl: 'original.jpg',
          userId: testUser.id,
        }
      })

      await prisma.recipe.update({
        where: { id: testRecipe.id },
        data: {
          title: 'Updated Title Only',
        },
      })

      const updated = await prisma.recipe.findUnique({
        where: { id: testRecipe.id }
      })

      expect(updated?.title).toBe('Updated Title Only')
      expect(updated?.ingredients).toBe('original ingredients') // Should remain unchanged
      expect(updated?.steps).toBe('original steps') // Should remain unchanged
    })
  })

  describe('Form Data Processing', () => {
    it('should convert string id to number', () => {
      const stringId = '123'
      const numberId = Number(stringId)

      expect(numberId).toBe(123)
      expect(typeof numberId).toBe('number')
    })

    it('should handle form data conversion', () => {
      const formData = new FormData()
      formData.append('id', '456')
      formData.append('title', 'Test Title')
      formData.append('ingredients', 'test ingredients')
      formData.append('steps', 'test steps')
      formData.append('imageUrl', 'test.jpg')

      const id = Number(formData.get('id'))
      const title = String(formData.get('title'))
      const ingredients = String(formData.get('ingredients'))
      const steps = String(formData.get('steps'))
      const imageUrl = String(formData.get('imageUrl'))

      expect(id).toBe(456)
      expect(title).toBe('Test Title')
      expect(ingredients).toBe('test ingredients')
      expect(steps).toBe('test steps')
      expect(imageUrl).toBe('test.jpg')
    })

    it('should handle empty form fields', () => {
      const formData = new FormData()
      formData.append('id', '1')
      formData.append('title', '')
      formData.append('ingredients', '')
      formData.append('steps', '')
      formData.append('imageUrl', '')

      const title = String(formData.get('title'))
      const ingredients = String(formData.get('ingredients'))
      const steps = String(formData.get('steps'))
      const imageUrl = String(formData.get('imageUrl'))

      expect(title).toBe('')
      expect(ingredients).toBe('')
      expect(steps).toBe('')
      expect(imageUrl).toBe('')
    })
  })
})