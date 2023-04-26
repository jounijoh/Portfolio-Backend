import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({

    category: {
        type: String,
        required: true,
        enum: ["Frontend", "Backend", "Others"],
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },


});

export const Skill = mongoose.model("Skill", skillSchema);
