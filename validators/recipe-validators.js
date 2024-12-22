import * as yup from 'yup'
import mongoose from 'mongoose'

// Validator for `id` in `req.params` (used for `completeRecipe`, `deleteRecipe` et `updateRecipe`)
const recipeIdValidator = yup.object().shape({
    id: yup
        .string()
        .required('Recipe ID is required')
        .test('is-valid-id', 'Invalid recipe ID', (value) => mongoose.Types.ObjectId.isValid(value)),
})

const recipeBodyValidator = yup.object().shape({
    title: yup.string().required('Title is required').max(100, 'Title must be less than 100 characters'),
    description: yup.string().required('Description is required').max(2000, 'Description must be less than 500 characters'),
    cover_image: yup.object({
        public_id: yup.string().nullable().trim(),
        url: yup
            .string()
            .nullable()
            .trim()
            .matches(/^https?:\/\/.+/, 'cover picture URL is invalid')
            .max(200, 'Cover picture URL must be less than 200 characters'),
    }),
    readyInMinutes: yup.string().required('Ready in minutes is required').min(1, 'Ready in minutes must be at least 1'),
    servings: yup.string().required('Servings is required').min(1, 'Servings must be at least 1'),

    extendedIngredients: yup
        .array()
        .of(
            yup.object({
                amount: yup
                    .number()
                    .nullable()
                    .transform((value, originalValue) => (originalValue === 'undefined' ? null : value)), // Handle undefined as null

                name: yup.string().required('Ingredient name is required'),
                unit: yup.string().nullable().notRequired(), // Allow empty unit
                original: yup.string().nullable().notRequired(), // Allow empty original description
            })
        )
        .required('Extended ingredients are required'),
})

// Validation pour les fichiers uniquement
const fileValidator = yup.object().shape({
    coverPicture: yup
        .mixed()
        .nullable()
        .test('fileExists', "Aucun fichier n'a été téléchargé", (value) => {
            return value && value.size > 0
        })
        .test('fileSize', 'Fichier trop volumineux', (value) => {
            if (!value) return true
            return value.size <= 10 * 1024 * 1024 // 10 Mo
        })
        .test('fileType', 'Format de fichier non supporté', (value) => {
            if (!value) return true
            return ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].includes(value.mimetype)
        }),
})

export { recipeIdValidator, recipeBodyValidator, fileValidator }
