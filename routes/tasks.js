const express = require('express');
const router = express.Router();
const {getAllTasks,createTask,getSTask,updateTask,deleteTask} = require('../controller/tasks1'); 

router.route('/').get(getAllTasks).post(createTask);
router.route('/:id').get(getSTask).patch(updateTask).delete(deleteTask); 

module.exports = router; 