import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const UserSchema = new mongoose.Schema(
    {
        //_id: mongoose.Schema.Types.ObjectId,
        username: {
            type: String,
            lowercase: true,
            unique: true,
            required: [true, "can't be blank"],
            match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
            index: true,
        },
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: [true, "can't be blank"],
            match: [/\S+@\S+\.\S+/, 'is invalid'],
            index: true,
        },
        password: String,
        bio: String,
        image: {
            data: String,
            contentType: String,
        },
        salt: String,
        isAdmin: Boolean,
        todos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'todos' }],
        topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'topics' }],
    },
    { timestamps: true }
)

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' })

const UserModel = mongoose.model('User', UserSchema)

export default UserModel
