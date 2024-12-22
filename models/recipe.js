import mongoose from 'mongoose'

// Schema for Recipe
const RecipeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    title: { type: String, required: true },
    description: { type: String, required: true },
    readyInMinutes: { type: String, required: true },
    servings: { type: String, required: true },
    cover_image: {
        public_id: {
            type: String,
            trim: true,
            default: null,
        },
        url: {
            type: String,
            trim: true,
            match: [/^https?:\/\/.+/, 'cover picture URL is invalid'],
            maxlength: [200, 'Profile picture URL must be less than 200 characters'],
            default: null,
        },
    },

    extendedIngredients: [{ name: String, original: String, amount: String, unit: String }],
    /* name: z.string(),
    original: z.string(),
    amount: z.number(),
    unit: z.string(), */
})

// Model for Recipe
const Recipe = mongoose.model('Recipe', RecipeSchema)

export default Recipe
