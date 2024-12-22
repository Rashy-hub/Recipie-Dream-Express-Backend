import asyncHandler from 'express-async-handler'
import Recipe from '../models/recipe.js'

import { SuccessResponse } from '../utils/response-schemas.js'
import { BadRequestErrorResponse, ForbiddenErrorResponse, NotFoundErrorResponse } from '../utils/error-schemas.js'

// Get all recipes
export const getRecipes = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const recipes = await Recipe.find({ userId: userId })

    const response = new SuccessResponse('Recipes retrieved successfully', { recipes })

    res.status(response.status).json(response)
})

// Get a single recipe by id
export const getRecipe = asyncHandler(async (req, res) => {
    const { id } = req.validatedParams

    const recipe = await Recipe.findById(id)
    if (!recipe) {
        throw new NotFoundErrorResponse('Recipe not found')
    }

    if (recipe.user.toString() !== req.user.id) {
        throw new ForbiddenErrorResponse('Unauthorized: Not allowed to get this recipe (not yours)')
    }

    const response = new SuccessResponse('Recipe found successfully', { recipe })
    res.status(response.status).json(response)
})

// Add a single recipe with or without files - multipart form
export const addRecipe = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const { title, description, cover_image, readyInMinutes, servings, extendedIngredients } = req.body
    const recipe = new Recipe({ title, description, cover_image, userId: userId, readyInMinutes, servings, extendedIngredients })

    if (req.uploadResults) {
        req.uploadResults.forEach((upload) => {
            if (upload.fieldname === 'coverPicture' && upload.result) {
                recipe.cover_image = {
                    public_id: upload.result.public_id,
                    url: upload.result.secure_url,
                }
            }
        })
    }

    await recipe.save()

    const response = new SuccessResponse('Recipe added successfully', { recipe })
    res.status(response.status).json(response)
})

// with files

// Update a recipe by id
export const updateRecipe = asyncHandler(async (req, res) => {
    const { id } = req.validatedParams
    const { title, description, cover_image, ingredients, isArchived, topicId } = req.body

    const recipe = await Recipe.findById(id)
    if (!recipe) {
        throw new NotFoundErrorResponse('Recipe not found')
    }

    if (recipe.user.toString() !== req.user.id) {
        throw new ForbiddenErrorResponse('Unauthorized: Cannot update this recipe')
    }

    if (title !== undefined) {
        recipe.title = title
    }

    if (description !== undefined) {
        recipe.description = description
    }

    if (cover_image !== undefined) {
        recipe.cover_image = cover_image
    }

    if (ingredients !== undefined) {
        recipe.ingredients = ingredients
    }

    if (isArchived !== undefined) {
        recipe.isArchived = isArchived
    }

    await recipe.save()

    const response = new SuccessResponse('Recipe updated successfully', { recipe })
    res.status(response.status).json(response)
})

// Delete a recipe by id
export const deleteRecipe = asyncHandler(async (req, res) => {
    const { id } = req.validatedParams
    console.log(id)

    const recipe = await Recipe.findById(id)
    if (!recipe) {
        throw new NotFoundErrorResponse('Recipe not found')
    }

    if (recipe.userId.toString() !== req.user.id) {
        throw new ForbiddenErrorResponse('Unauthorized: Cannot delete this recipe')
    }

    await Recipe.deleteOne({ _id: id })

    const response = new SuccessResponse('Recipe deleted successfully')
    res.status(response.status).json(response)
})

// Deletes all recipes for a user
export const clearRecipes = asyncHandler(async (req, res) => {
    const userId = req.user.id

    await Recipe.deleteMany({ user: userId })

    const response = new SuccessResponse('All recipes cleared successfully')
    res.status(response.status).json(response)
})
