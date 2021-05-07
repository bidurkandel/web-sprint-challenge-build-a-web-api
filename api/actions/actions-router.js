// Write your "actions" router here!
// Write your "actions" router here!
const express = require('express');
const Actions = require('./actions-model');
const { validateActionId, validateAction, validateProjectId } = require('../middleware/middleware');

const router = express.Router();

// Actions Endpoints
router.get('/', async (req, res, next) => {
    try {
        const actions = await Actions.get();
        res.json(actions);
    } catch (err) { next(err) }
});

router.get('/:id', validateActionId, async (req, res, next) => {
    res.json(req.action);
});

router.post('/', validateAction, validateProjectId, async (req, res, next) => {
    try {
        const actionToCreate = req.body;
        const actionCreated = await Actions.insert(actionToCreate);
        res.status(201).json(actionCreated);
    } catch (err) { next(err) }
});

router.put('/:id', validateAction, validateActionId, async (req, res, next) => {
    const { id } = req.params;
    const actionToUpdate = req.body;

    try {
        const actionUpdated = await Actions.update(id, actionToUpdate);
        actionUpdated
            ? res.json(actionUpdated)
            : res.status(500).json({ message: "Update failed, please try again" })
    } catch (err) { next(err) }
});

router.delete('/:id', validateActionId, async (req, res, next) => {
    const { id } = req.params;

    try {
        const deletedAction = await Actions.remove(id);
        deletedAction
            ? res.json({ message: `Action with id ${id} successfully deleted` })
            : res.status(500).json({ message: "Deletion failed, please try again" })
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