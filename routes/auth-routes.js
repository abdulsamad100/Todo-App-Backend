const express = require("express");
const fs = require("fs");
const path = require('path');
const router = express.Router();
const Joi = require('joi');
require('dotenv').config();
const { v4: uuidv4 } = require("uuid");
const { generateAccessToken, chkFile } = require("../utils/helper");


router.post("/login", (req, res) => {
    const loginData = req.body
    const wholepath = path.join(process.cwd(), "/files", "user.json")

    if (!chkFile("user.json")) {
        return res.json({ message: "User Not Found" })
    }

    const Schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).required(),
    })

    const validate = Schema.validate(loginData)
    if (validate.error) {
        return res.status(400).json({ message: validate.error.message })
    }
    const FileData = fs.readFileSync(wholepath);
    const oldData = JSON.parse(FileData);

    const chkUser = oldData.data.find((d) => d.email == validate.value.email && d.password == validate.value.password)
    if (!chkUser) {
        return res.status(400).json({ message: "User Not Found" })
    }
    
    console.log("{ message: 'User Found' }");
    try {
     
    const token = generateAccessToken(chkUser.id,process.env.JWT_SECRET);
    delete chkUser.password;
    res.json({
        message: "Logged in success",
        data: {
            token,
            user: chkUser,
        },
    });   
    } catch (error) {
       console.log(error.message);
        
    }
})

router.post("/signup", (req, res) => {
    const wholepath = path.join(process.cwd(), "/files", "user.json")

    if (!chkFile("user.json")) {
        const data = { data: [] }
        fs.writeFileSync(wholepath, JSON.stringify(data))
    }
    const signupData = req.body

    const Schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).required(),
    })

    const validate = Schema.validate(signupData)
    if (validate.error) {
        return res.status(400).json({ message: validate.error.message })
    }

    const FileData = fs.readFileSync(wholepath);
    const oldData = JSON.parse(FileData);

    const existed_user = oldData.data.find((d) => d.email == validate.value.email)
    if (existed_user) {
        return res.status(409).json({ message: "User Already Exist" })
    }
    const { email, password } = req.body
    oldData.data.push({ id: uuidv4(), email, password })

    fs.writeFileSync(wholepath, JSON.stringify(oldData))
    res.json({ message: "data added" })
})

const authroutes = router
module.exports = authroutes;