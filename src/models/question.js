import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    title: { type: String, required: true }, // type of the question
    description: { type: String, required: true }, // ask
    options: {type: String, required: true},
    correctOption: {type: Array, required: true},
    difficult: {type: String, required: true}
}, { versionKey: false } )

const question = mongoose.model('questions', questionSchema)

export { question, questionSchema }