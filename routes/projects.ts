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
    if (skills.length > 0) {
      for (const skill of skills) {
        if (isValidObjectId(skill)) {
          // Check if a skill exists with this ObjectId
          const foundSkill = await Skill.findById(skill);
          if (foundSkill) {
            skillIds.push(foundSkill._id);
          } else {
            // If not found by Id, try to find by name
            const foundSkill = await Skill.findOne({ name: skill });
            if (!foundSkill) throw new Error(`Skill not found: ${skill}`);
            skillIds.push(foundSkill._id);
          }
        } else {
          // If it's not a valid ObjectId, assume it's a name and find by name
          const foundSkill = await Skill.findOne({ name: skill });
          if (!foundSkill) throw new Error(`Skill not found: ${skill}`);
          skillIds.push(foundSkill._id);
        }
      }
    }

    const project = new Project({
      name: req.body.name,
      description: req.body.description,
      imageSrc: req.body.imageSrc,
      skills: skillIds,
      links: req.body.links,
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

// Add a skill to a specific project
router.patch('/:projectId/addSkillByName', async (req, res) => {
  const { projectId } = req.params;
  const { skillName } = req.body;

  try {
    // Find the project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Find the skill by name
    const skill = await Skill.findOne({ name: skillName });
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // Check if the skill is already associated with the project
    if (project.skills.includes(skill._id)) {
      return res.status(400).json({ message: 'Skill is already associated with the project' });
    }

    // Add the skill to the project and save the project
    project.skills.push(skill._id);
    await project.save();

    // Send the updated project as a response
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
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