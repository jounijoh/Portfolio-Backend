# Portfolio Website Backend

This repository contains the source code for the backend of my personal portfolio website, which manages data for my skills, about me, and projects sections.

The portfolio is live and hosted on Vercel. You can visit the live site at: [Portfolio](https://portfolio-sand-rho-53.vercel.app/)

Frontend Repository can be found here: [Frontend Repo](https://github.com/jounijoh/Portfolio-Frontend/)

## Features

- **RESTful API Endpoints**: These serve data for skills, about, and projects for the portfolio frontend.

- **MongoDB Connection**: Utilizes Mongoose to connect and manage data in a MongoDB database.

- **Debugging and Monitoring**: Monitors and logs MongoDB commands for debugging purposes.

## Tech Stack

The backend infrastructure is built using:

- **Express.js**: Manages the server and routing for the backend.

- **Mongoose**: An elegant solution to work with MongoDB using object data modeling.


## API Endpoints

The main API routes provided by this backend include:

- `/api/skills`: Endpoints related to showcasing and managing technical skills.

- `/api/about`: Endpoints related to the "About Me" section.

- `/api/projects`: Endpoints that manage and provide project details.

## MongoDB Management

The backend has a robust setup to manage the MongoDB connection:

- **Connection Events**: Listens to key events to log connection statuses, like errors or successful connections.

- **MongoDB Client Monitoring**: Uses the MongoDB Node.js driver to monitor command starts, successes, and failures, aiding in debugging and ensuring stable data interactions.

## Project Structure

The main server setup initializes middleware, establishes a connection to MongoDB, and sets up routes. The routes are modular, each residing in its respective file for skills, about, and projects.

The database connection and monitoring functionalities have been abstracted to another file, ensuring code modularity and cleanliness.

