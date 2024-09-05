// this file create the user fectch the user from the backend
const express = require('express');
require('dotenv').config()
const { body, validationResult } = require('express-validator');
const USER = require("../modles/USER");
const router = express.Router();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const JWT_secret = process.env.JWT_secret;
const fetchuser = require("../middleware/fetchuser");
const searched = require('./searched');



router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a vaild email').isEmail(),
    body('password', 'Enter a vaild password of 5 length').isLength({ min: 5 })
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success,errors: errors.array() });
    }
    let user = await USER.findOne({ email: req.body.email });
    if (user) {
            return res.status(400).json({ success,error: "soory already there in data" })
    }

    var salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    user = await USER.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email
    })

    const data = {
        user: {
            id: user.id
        }
    }
    // res.json(user)
    const authtoken = jwt.sign(data, JWT_secret);
    // console.log(Jwtdata);
    success = true;

    res.json({success,authtoken})
})



router.post('/login', [
    body('email', 'Enter a vaild email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await USER.findOne({ email });
        if (!user) {
            success = false;
            return res.status(400).json({success, error: "please write correct credentials" });
        }

        const pass = await bcrypt.compare(password, user.password);
        if (!pass) {
            success = false;
            return res.status(400).json({ success,error: "please write correct credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_secret);
        console.log(authtoken);
        success = true;
        res.send({success, authtoken})
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some internal error");
    }
})

// ******************** Getting user details ***********************


router.get('/getuserdetails', fetchuser, async (req, res) => {
    try {
        const userID = req.user.id;
        const user = await USER.findById(userID).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some internal error");
    }
})


router.put('/updateuser', fetchuser, async (req, res) => {
    try {
        const { name } = req.body;
        const userID = req.user.id;

        // Validate the name
        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        // Find the user by ID
        const user = await USER.findById(userID);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.name = name;

        // Save the updated user
        await user.save();

        // Return the updated user details
        res.json({ message: "User name updated successfully", user });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some internal error occurred");
    }
});

router.post("/search-user",searched);


module.exports = router;