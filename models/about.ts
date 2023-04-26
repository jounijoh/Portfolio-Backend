import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
    contentType: {
        type: String,
        required: true,
    },
    context: {
        type: String,
        required: true,
    },
    position: {
        type: Number,
        required: true,
    },
});

export const About = mongoose.model("about", aboutSchema);