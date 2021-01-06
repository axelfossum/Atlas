const router = require('express').Router();
let TasksModel = require('../models/tasks.model');
const timezoneOffset = new Date().getTimezoneOffset()*60*1000;
const auth = require('../middleware/auth');

router.get('/', auth, async (req,res) => {
    try{
        await TasksModel.find({user: req.user})
        .then(tasks => res.json(tasks))
        .catch(err => res.status(404).json('ErrorTasksGet: ' + err));
    }
    catch(err){
        // Something did not work out
        res.status(500).json({ error: err.message });
    }
});

router.get('/sortByDate', auth, async (req,res) => {
    try{
        await TasksModel.find({user:req.user}).sort({'deadline': 1})
        .then(tasks => res.json(tasks))
        .catch(err => res.status(404).json('ErrorTasksGet: ' + err));
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
});

router.post('/add', auth, async (req,res) => {
    try{
    
        const newTask = await new TasksModel({
            title: req.body.title, 
            course: req.body.course, 
            description: req.body.description, 
            deadline: req.body.deadline,
            user: req.user, 
            finished: req.body.finished
        });

        await newTask.save()
            .then(() => res.json('Task added!'))
            .catch(err => res.status(400).json('ErrorAddSave: ' + err));
            
    }
    catch(err){
        // Something did not work out
        res.status(500).json({ error: err.message });
    }
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