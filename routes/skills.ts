import express from 'express';
const router = express.Router();
import { Skill } from '../models/skill';



// Middleware function for getting skill object by ID
const getSkill = async (req: any, res: any, next: any) => {
    let skill: any;
    try {
        skill = await Skill.findById(req.params.id);
        if (skill == null) {
            return res.status(404).json({ message: 'Cannot find skill' })
        }
    } catch (error: any) {
        return res.status(500).json({ message: error.message })
    }

    res.skill = skill;
    next();
}
//Get all skills
router.get('/', async (req: any, res: any) => {
    try {
        const skills = await Skill.find();
        res.json(skills);
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
})

//get all skills grouped into categories and soted alphabetically
router.get('/groupbycategory', async (req: any, res: any) => {
    try {
      const groupedSkills = await Skill.aggregate([
        {
          $group: {
            _id: "$category",
            skills: {
              $push: {
                _id: "$_id",
                name: "$name",
                description: "$description",
              },
            },
          },
        },
        {
          $sort: {
            _id: 1, // Sort categories alphabetically in ascending order
          },
        },
      ]);
  
      res.json(groupedSkills);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

//Get one skill
router.get('/:id', getSkill, (req: any, res: any) => {
    res.json(res.skill)

})

//Create one skill
router.post('/', async (req: any, res: any) => {
    const skill = new Skill({
        category: req.body.category,
        name: req.body.name,
        description: req.body.description,
    })

    try {
        const newSkill = await skill.save();
        res.status(201).json(newSkill);
    } catch (error) {
        if (error.code === 11000) { // MongoError code for duplicate key
            res.status(400).json({ message: "Skill with this name already exists." });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
});

//create many skills
router.post('/addmany', async (req: any, res: any) => {
    const skills = req.body.skills;
    try {
        const newSkills = await Skill.insertMany(skills);
        res.status(201).json(newSkills);
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
})

//Update one skill
router.patch('/:id', getSkill, (req: any, res: any) => {
})

//Delete one skill
router.delete('/:id', getSkill, async (req: any, res: any) => {
    try {
        await res.skill.deleteOne();
        res.json({ message: 'Deleted skill' })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
})



export default router;