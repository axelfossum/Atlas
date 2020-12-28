const router = require('express').Router();
let ActiveTasksModel = require('../models/active_tasks.model');
const timezoneOffset = new Date().getTimezoneOffset()*60*1000;

router.route('/').get((req,res) => {
    ActiveTasksModel.find()
        .then(tasks => res.json(tasks))
        .catch(err => res.status(404).json('ErrorTasksGet: ' + err));
});

router.route('/add').post((req,res) => {
    const title = req.body.title;
    const course = req.body.course;
    const description = req.body.description;
    const deadline = req.body.deadline;

    const newTask = new ActiveTasksModel({
        title, course, description, deadline
    });

    newTask.save()
        .then(() => res.json('Task added!'))
        .catch(err => res.status(400).json('ErrorAddSave: ' + err));
});

router.route('/:id').delete((req,res) => {
    ActiveTasksModel.findByIdAndDelete(req.params.id)
        .then(() => res.json('Task deleted.'))
        .catch(err => res.status(400).json(err));
})

router.route('/:id').get((req,res) => {
    ActiveTasksModel.findById(req.params.id)
        .then(task => res.json(task))
        .catch(err => res.status(400).json(err));
});

router.route('/update/:id').post((req,res) => {
    ActiveTasksModel.findById(req.params.id)
        .then(task => {
            task.title = req.body.title;
            task.description = req.body.description;
            task.course = req.body.course;
            task.deadline = new Date(Date.parse(req.body.deadline) - timezoneOffset);

            task.save()
                .then(() => res.json('Task updated! ' + task.deadline))
                .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
});

module.exports = router;