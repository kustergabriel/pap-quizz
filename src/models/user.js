import mongoose from "mongoose";
import { questionSchema } from './question'


const userSchema = new mongoose.Schema ( {
    id: { type: mongoose.Schema.Types.ObjectId },
    name: {type:String, required:True},
    nickname: {type:String, required:True},
    email: {type:String, required:True},
    points: {type:Number},
    questionsRight: [questionSchema],
    questionsWrong: [questionSchema],
    questionsVinculed: [questionSchema]
}, { versionKey: false } )

const user = mongoose.model("users", userSchema)

export default user