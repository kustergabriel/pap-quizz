import mongoose from "mongoose";
import { questionSchema } from './question.js'


const userSchema = new mongoose.Schema ( {
    id: { type: mongoose.Schema.Types.ObjectId },
    name: {type:String, required:true},
    nickname: {type:String, required:true},
    email: {type:String, required:true},
    cpf: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    points: {type:Number},
    adm: {type: Boolean, default: false},
    questionsRight: [questionSchema],
    questionsWrong: [questionSchema],
    questionsVinculed: [questionSchema]
}, { versionKey: false } )

const user = mongoose.model("users", userSchema)

export default user