import express from 'express'
import passport from 'passport'
import * as recipeController from '../controllers/recipe-controller.js'
import paramsValidation from '../middleware/params-validation.js'
import { recipeBodyValidator, recipeIdValidator } from '../validators/recipe-validators.js'
import bodyValidation from '../middleware/body-validation.js'
import { fileValidator } from '../validators/recipe-validators.js'
import multerMiddleware from '../middleware/multer-middleware.js'
import cloudinaryMiddleware from '../middleware/cloudinary-middleware.js'
import bodyWithFilesValidation from '../middleware/form-data-validation.js'

// Middleware to handle file uploads
const uploadProfileFiles = multerMiddleware({
    fields: [{ name: 'coverPicture', maxCount: 1 }],
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxFileSize: 10 * 1024 * 1024, // 10 MB
})

const cloudinaryUpload = cloudinaryMiddleware({
    resourceType: 'auto', // Automatically detect file type
    folderPath: 'recipeDream/recipes',
})

const recipeRouter = express.Router()

recipeRouter.get('/recipe/', passport.authenticate('jwt', { session: false }), recipeController.getRecipes)
recipeRouter.get('/recipe/:id', passport.authenticate('jwt', { session: false }), paramsValidation(recipeIdValidator), recipeController.getRecipe)
recipeRouter.post(
    '/recipe',
    passport.authenticate('jwt', { session: false }),
    uploadProfileFiles,
    bodyWithFilesValidation(recipeBodyValidator, fileValidator),
    cloudinaryUpload,
    recipeController.addRecipe
)
recipeRouter.put(
    '/recipe/:id',
    passport.authenticate('jwt', { session: false }),
    paramsValidation(recipeIdValidator),
    uploadProfileFiles,
    bodyValidation(recipeBodyValidator),
    recipeController.updateRecipe
)
recipeRouter.delete('/recipe', passport.authenticate('jwt', { session: false }), recipeController.clearRecipes) // Supprime toutes les recettes
recipeRouter.delete(
    '/recipe/:id',
    passport.authenticate('jwt', { session: false }),
    paramsValidation(recipeIdValidator),
    recipeController.deleteRecipe
)

export default recipeRouter
