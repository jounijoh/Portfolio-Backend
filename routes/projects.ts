import express from 'express';
import { Request, Response, NextFunction } from 'express';
const router = express.Router();
import { Project } from '../models/project';
import { Skill } from '../models/skill';
import mongoose from 'mongoose';

interface CustomResponse extends Response {
  project?: any;
}

// Middleware function for getting project object by ID
const getProject = async (req: Request, res: CustomResponse, next: NextFunction) => {
  let project: any;
  try {
    project = await Project.findById(req.params.id);
    if (project == null) {
      return res.status(404).json({ message: 'Cannot find project' })
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }

  res.project = project;
  next();
}

// Get a project by ID along with its associated skills
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("skills");
    if (project == null) {
      return res.status(404).json({ message: "Cannot find project" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get all projects
router.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().populate('skills').sort({ position: 1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Utility function to check if a string is a valid ObjectId
const isValidObjectId = (id: string) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Create one project and check if skills are given as names or ObjectIds
router.post("/", async (req: Request, res: Response) => {
  const skills = req.body.skills;
  let skillIds: mongoose.Types.ObjectId[] = [];

  try {
    if (skills.length > 0 && isValidObjectId(skills[0])) {
      // If skills contain ObjectIds, check if they exist in the database
      skillIds = await Promise.all(
        skills.map(async (id: mongoose.Types.ObjectId) => {
          const skill = await Skill.findById(id);
          if (!skill) {
            throw new Error(`Skill not found with ID: ${id}`);
          }
          return skill._id;
        })
      );
    } else {
      // If skills contain names, convert them to ObjectIds
      skillIds = await Promise.all(
        skills.map(async (name: string) => {
          const skill = await Skill.findOne({ name });
          if (!skill) {
            throw new Error(`Skill not found: ${name}`);
          }
          return skill._id;
        })
      );
    }

    const project = new Project({
      name: req.body.name,
      description: req.body.description,
      imageSrc: req.body.imageSrc,
      skills: skillIds,
      position: req.body.position,
    });

    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



// Update one project
router.patch('/:id', getProject, async (req: Request, res: CustomResponse) => {
  if (req.body.name != null) {
    res.project.name = req.body.name;
  }
  if (req.body.description != null) {
    res.project.description = req.body.description;
  }
  if (req.body.imageSrc != null) {
    res.project.imageSrc = req.body.imageSrc;
  }
  if (req.body.skills != null) {
    res.project.skills = req.body.skills;
  }
  if (req.body.links != null) {
    res.project.links = req.body.links;
  }
  if (req.body.position != null) {
    res.project.position = req.body.position;
  }
  try {
    const updatedProject = await res.project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete one project
router.delete('/:id', getProject, async (req: Request, res: CustomResponse) => {
  try {
    await res.project.remove();
    res.json({ message: 'Deleted project' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router