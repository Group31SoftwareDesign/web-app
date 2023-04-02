const mongoose = require("mongoose")


const addressSchema = new mongoose.Schema({
    street: String,
    city: String
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },email: {
        type: String,
        required: true,
       // min: 10,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    },
    age: {
        type: Number,
        min: 1,
        max: 100,
        validate: {
            validator: v => v % 2 == 0,
            message: props => '{$props.value} is not an even number'
        }
    },
    bestFriend: mongoose.SchemaTypes.ObjectId,
    hobbies: [String],
    address: addressSchema
})

module.exports = mongoose.model("User", userSchema)