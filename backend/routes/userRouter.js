const router = require('express').Router();
const Users = require('../models/users.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');




router.post('/register', async (req, res) => {
    try{
        const { email, password, passwordConfirm, firstname, lastname } = req.body;

        // Check if all fields have been filled
        if(!email || !password || !passwordConfirm || !firstname || !lastname)
            return res.status(400).json({msg: 'Not all fields have been entered.'});

        // Check password length
        if(password.length < 6)
            return res.status(400).json({msg: 'Password must be at least 6 characters long.'});

        // Check if passwords match
        if(password !== passwordConfirm)
            return res.status(400).json({msg: 'Passwords do not match.'});

        // Try and find an existing user with the entered email address
        const existingUser = await Users.findOne({email: email});
        if(existingUser)
            return res.status(400).json({msg: 'An account with this email already exists.'});

        // Hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new Users({
            email,
            password: hashedPassword,
            firstname,
            lastname
        });

        // Save new user
        const savedUser = await newUser.save();

        // Return saved user to frontend as a json object
        res.json(savedUser);

    }   
    catch(err){
        // Something did not work out
        res.status(500).json({ error: err.message });
    }
});




router.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        
        // Validate
        if(!email || !password)
            return res.status(400).json({msg: 'Not all fields have been entered.'});

        // Find the user to which the email belongs
        const user = await Users.findOne({email: email});
        if(!user)
            return res.status(400).json({msg: 'Could not find an account with this email.'});

        // Check if the entered password matches the hashed password for the found user
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch)
            return res.status(400).json({msg: 'Invalid password.'});

        // Encode a JSON Web Token (JWT). Used for authorization across the site.
        // This will essentially allow the user to stay logged in and do stuff they are permitted to do while
        // countering different kind of cyber hazards. JWT is used for user and app security.
        //
        // NEVER, EVER, EVER store password in a JSON Web Token because the token can easily be decoded and the password will be revealed.
        //
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        // Return JSON Web Token and some information about the user to the frontend
        res.json({
            token,
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname
            }
        });

    }
    catch(err){
        // Something did not work out
        res.status(500).json({ error: err.message });
    }
});



router.delete('/delete', auth, async (req, res) => {
    try{
        // Delete user from database
        const deletedUser = await Users.findByIdAndDelete(req.user);
        // Pass the deleted user to the frontend in case we wish to use some information
        // to say goodbye or similar.
        res.json(deletedUser);
    }
    catch(err){
        // Something did not work out
        res.status(500).json({ error: err.message });
    }
});


// Endpoint used to verify if someone is logged in or not. Can be used to display different things on the site
// depending on if someone is logged in.
router.post('/tokenIsValid', async (req,res) => {
    try{
        const token = req.header('x-auth-token');
        if(!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified) return res.json(false);

        const user = await Users.findById(verified.id);
        if(!user) return res.json(false);

        return res.json(true);
    }
    catch(err){
        // Something did not work out
        res.status(500).json({ error: err.message });
    }
});


router.get('/getuser', auth, async (req, res) => {
    try{
        const user = await Users.findById(req.user);
        res.json({
            firstname: user.firstname,
            lastname: user.lastname,
            id: user._id,
            courses: user.courses
        });
    }
    catch(err){
        // Something did not work out
        res.status(500).json({ error: err.message });
    }
});


router.post('/add-course', auth, async (req, res) => {
    try{
        const courseToAdd = {coursename: req.body.newCourse, coursecolor: req.body.newCourseColor};
        if(req.body.newCourse){
            const user = await Users.findByIdAndUpdate(
                { _id: req.user },
                { $addToSet: {courses: courseToAdd} },
                { upsert: true }
            );
        }
    }
    catch(err){
        // Something did not work out
        res.status(500).json({ error: err.message });
    }
});


router.delete('/remove-course/:course', auth, async (req, res) => {
    try{
        if(req.params.course){
            const user = await Users.findByIdAndUpdate(
                { _id: req.user },
                { $pull: {courses: {coursename: req.params.course}} }
            );
        }
    }
    catch(err){
        // Something did not work out
        res.status(500).json({ error: err.message });
    }
});


router.post('/update-course', auth, async (req, res) => {
    try{
        if(req.body.editCourseText){
            // Check if a course with the new name already exists
            const courseExists = await Users.findOne(
                { _id: req.user, courses: req.body.editCourseText }
            );

            // Remove selected course and add a new course with the new desired title
            if(!courseExists){
                // Add
                await Users.findOneAndUpdate(
                    { _id: req.user, courses: req.body.originalCourse },
                    { $set: {"courses.$": req.body.editCourseText} }
                );

                return res.json('Edited course!');
            } else {
                return res.status(400).json({ msg: 'A course with this name already exists.' });
            }
        }
    }
    catch(err){
        // Something did not work out
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;