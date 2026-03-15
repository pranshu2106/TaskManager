const Task = require('../models/tasks2');
const aysncWrapper = require('../middlewares/async');
const {createCustomError} = require('../errors/customerrormsg'); 

const getAllTasks = aysncWrapper ( async (req, res) => {
    
    const tasks = await Task.find({});
    res.status(200).json({ tasks});
    
});

const createTask = aysncWrapper ( async (req, res) => {
    
    const task = await Task.create(req.body);
    res.status(201).json({ task });
    
});

const getSTask = aysncWrapper ( async (req, res ,next) => {
    
    const { id: taskID } = req.params;
    const task = await Task.findOne({ _id: taskID });

    if (!task) {
        return next(createCustomError(`Task with ID ${taskID} does not exist`,404));
    }

    res.status(200).json({ task });
    
} );

const deleteTask = aysncWrapper( async (req, res ,next) => {
    
    const { id: taskID } = req.params;
    const task = await Task.findOneAndDelete({ _id: taskID });

    if (!task) {
    return next(createCustomError(`Task with ID ${taskID} does not exist`,404));
    }

    res.status(200).json({ task });
    
});

const updateTask = aysncWrapper( async (req, res ,next) => {
    
    const { id: taskID } = req.params;
    const task = await Task.findOneAndUpdate(
    { _id: taskID },
    req.body,
    { new: true, runValidators: true }
    );

    if (!task) {
    return next(createCustomError(`Task with ID ${taskID} does not exist`,404));
    }

    res.status(200).json({ task });
});

module.exports = {
    getAllTasks,
    createTask,
    getSTask,
    updateTask,
    deleteTask
};