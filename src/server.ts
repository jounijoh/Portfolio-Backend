import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import express from 'express';
import skillsRouter from '../routes/skills';
import aboutRouter from '../routes/about';
import projectsRouter from '../routes/projects';
import cors from 'cors';

const app = express();

const PORT = process.env.PORT
const uri = process.env.MONGODB_URI

mongoose.connect(uri)

const db = mongoose.connection;
db.on('error', (error: any) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; img-src 'self' https://portfolio-backend-dmiq.onrender.com; script-src 'self' 'unsafe-inline'"
    );
    next();
  });
  
app.use('/api/skills', skillsRouter);
app.use('/api/about', aboutRouter);
app.use('/api/projects', projectsRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
