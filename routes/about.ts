import express from 'express';
import { Request, Response, NextFunction } from 'express';
const router = express.Router();
import { About } from '../models/about';

interface CustomResponse extends Response {
    about?: any;
  }

// Middleware function for getting about object by ID
const getAbout = async (req: Request, res: CustomResponse, next: NextFunction) => {
    let about: any;
    try {
        about = await About.findById(req.params.id);
        if (about == null) {
            return res.status(404).json({ message: 'Cannot find about' })
        }
    } catch (error: any) {
        return res.status(500).json({ message: error.message })
    }

    res.about = about;
    next();
}
//Get all abouts
router.get('/', async (req: Request, res: Response) => {
    try {
        const abouts = await About.find().sort({ position: 1 });
        res.json(abouts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create one about
router.post('/', async (req: Request, res: Response) => {
    const about = new About({
        contentType: req.body.contentType,
        context: req.body.context,
        position: req.body.position,
    });

    try {
        const newAbout = await about.save();
        res.status(201).json(newAbout);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//create many abouts
router.post('/addmany', async (req: Request, res: Response) => {
    const abouts = req.body.abouts;
    try {
        const newAbouts = await About.insertMany(abouts);
        res.status(201).json(newAbouts);
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
})

router.patch('/:id', getAbout, async (req: Request, res: CustomResponse) => {
    const { contentType, context, position } = req.body;
    if (contentType) res.about.contentType = contentType;
    if (context) res.about.context = context;
    if (position) res.about.position = position;

    try {
        const updatedAbout = await res.about.save();
        res.json(updatedAbout);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


//Delete one about
router.delete('/:id', getAbout, async (req: Request, res: CustomResponse) => {
    try {
        await res.about.deleteOne();
        res.json({ message: 'Deleted About' })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
})



export default router;