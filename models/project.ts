import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    skills: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill',
            required: false,
        }
    ],
    imageSrc: {
        type: String,
        required: false,
    },
    links: [
        {
            title: {
                type: String,
                required: false,
            },
            url: {
                type: String,
                required: false,
            },
        },
    ],
    position: {
        type: Number,
        required: false,
        default: Number.MAX_SAFE_INTEGER, // Default to the end of the list
    },
});

export const Project = mongoose.model("project", projectSchema);