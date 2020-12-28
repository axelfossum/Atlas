const router = require('express').Router();
let TasksModel = require('../models/tasks.model');
const timezoneOffset = new Date().getTimezoneOffset()*60*1000;

router.route('/').get((req,res) => {
    TasksModel.find()
        .then(tasks => res.json(tasks))
        .catch(err => res.status(404).json('ErrorTasksGet: ' + err));
});

router.route('/add').post((req,res) => {
    const title = req.body.title;
    const course = req.body.course;
    const description = req.body.description;
    const deadline = req.body.deadline;
    const finished = false;

    const newTask = new TasksModel({
        title, course, description, deadline, finished
    });

    newTask.save()
        .then(() => res.json('Task added!'))
        .catch(err => res.status(400).json('ErrorAddSave: ' + err));
});

router.route('/:id').delete((req,res) => {
    TasksModel.findByIdAndDelete(req.params.id)
        .then(() => res.json('Task deleted.'))
        .catch(err => res.status(400).json(err));
})

router.route('/:id').get((req,res) => {
    TasksModel.findById(req.params.id)
        .then(task => res.json(task))
        .catch(err => res.status(400).json(err));
});


router.route('/update/:id').post((req,res) => {
    TasksModel.findById(req.params.id)
        .then(task => {
            if(req.body.finished !== task.finished){
                task.finished  = !task.finished;
            }
            else{
                task.title = req.body.title;
                task.description = req.body.description;
                task.course = req.body.course;
                task.deadline = new Date(Date.parse(req.body.deadline) - timezoneOffset);
            }
            task.save()
                .then(() => res.json('Task updated!'))
                .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
});

module.exports = router;