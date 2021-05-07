const Actions = require('../actions/actions-model');
const Projects = require('../projects/projects-model');

async function validateActionId(req, res, next) {
    const { id } = req.params;
    try {
        const action = await Actions.get(id);
        if (action) {
            req.action = action;
            next();
        } else {
            res.status(404).json({ message: "Action not found" });
        }
    } catch (err) { next(err) }
};

function validateAction(req, res, next) {
    const { project_id, description, notes } = req.body;

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).json({ message: "Missing action data" });
    } else if (!project_id || !description || !notes) {
        res.status(400).json({ message: "Missing required field" });
    } else if (description.length > 128) {
        res.status(400).json({ message: "Description should be 128 characters long max" });
    } else {
        next();
    }
};

async function validateProjectId(req, res, next) {
    const id = req.params.id || req.body.project_id;
    try {
        const project = await Projects.get(id);
        if (project) {
            req.project = project;
            next();
        } else {
            res.status(404).json({ message: "Project not found" });
        }
    } catch (err) { next(err) }
};

function validateProject(req, res, next) {
    const { name, description } = req.body;

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).json({ message: "Missing project data" });
    } else if (!name || !description) {
        res.status(400).json({ message: "Missing required field" });
    } else {
        next();
    }
};

module.exports = {
    validateActionId,
    validateAction,
    validateProjectId,
    validateProject
}