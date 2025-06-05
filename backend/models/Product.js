import { Schema, model } from 'mongoose'

const Product = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number
    },
    category: {
        type: String
    },
    image: {
        type: String
    },
    rating: {
        type: String
    },
    description: {
        type: String
    }
})

export default model('Product', Product)