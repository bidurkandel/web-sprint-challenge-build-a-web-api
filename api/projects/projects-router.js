// Write your "projects" router here!
const express = require('express');
const Projects = require('./projects-model');
const { validateProject, validateProjectId } = require('../middleware/middleware');

const router = express.Router();

// Actions Endpoints
router.get('/', async (req, res, next) => {
    try {
        const projects = await Projects.get();
        res.json(projects);
    } catch (err) { next(err) }
});

router.get('/:id', validateProjectId, async (req, res, next) => {
    res.json(req.project);
});

router.post('/', validateProject, async (req, res, next) => {
    try {
        const newProject = await Projects.insert(req.body);
        res.status(201).json(newProject);
    } catch (err) { next(err) }
});

router.put('/:id', validateProject, validateProjectId, async (req, res, next) => {
    const { id } = req.params;
    const projectToUpdate = req.body;

    try {
        const updatedProject = await Projects.update(id, projectToUpdate);
        updatedProject
            ? res.status(200).json(updatedProject)
            : res.status(500).json({ message: "Update failed, please try again" })
    } catch (err) { next(err) }
});

router.delete('/:id', validateProjectId, async (req, res, next) => {
    const { id } = req.params;

    try {
        const deletedProject = await Projects.remove(id);
        deletedProject
            ? res.json({ message: `Project with id ${id} successfully deleted` })
            : res.status(500).json({ message: "Deletion failed, please try again" })
    } catch (err) { next(err) }
});

router.get('/:id/actions', validateProjectId, async (req, res, next) => {
    const { id } = req.params;

    try {
        const actions = await Projects.getProjectActions(id);
        res.json(actions);
    } catch (err) { next(err) }
});

// Error Handling
router.use((err, req, res, next) => { // eslint-disable-line
    res.status(500).json({
        message: err.message,
        stack: err.stack,
        custom: "Something went wrong in the actions router"
    });
});

// Export
module.exports = router;