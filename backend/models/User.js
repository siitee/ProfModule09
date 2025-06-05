import { Schema, model } from 'mongoose'

const User = new Schema({
    login: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    role: { 
        type: String, 
        default: 'user' 
    },
})

export default model('User', User)