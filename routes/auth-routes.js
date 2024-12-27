const express = require("express");
const fs = require("fs");
const path = require('path');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require("uuid");
const { generateAccessToken, chkFile } = require("../utils/helper");
require('dotenv').config();

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const UserModel = mongoose.model("users", userSchema)

router.post("/login", async (req, res) => {
    const loginData = req.body

    const Schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).required(),
    })

    const validate = Schema.validate(loginData)
    if (validate.error) {
        return res.status(400).json({ message: validate.error.message })
    }
    const FileData = await UserModel.find();
    const oldData = FileData;

    const chkUser = oldData.find((d) => d.email == validate.value.email && d.password == validate.value.password)
    if (!chkUser) {
        return res.status(400).json({ message: "User Not Found" })
    }

    console.log("{ message: 'User Found' }");
    try {

        const token = generateAccessToken(chkUser.id, process.env.JWT_SECRET);
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

router.post("/signup", async (req, res) => {
    const signupData = req.body;

    const Schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).required(),
    });

    const validate = Schema.validate(signupData);
    if (validate.error) {
        return res.status(400).json({ message: validate.error.message });
    }

    const { email, password } = validate.value;

    try {
        const existedUser = await UserModel.findOne({ email });
        if (existedUser) {
            return res.status(409).json({ message: "User Already Exist" });
        }

        const newUser = new UserModel({ email, password });
        await newUser.save();

        res.json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error during signup:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const user_model = UserModel
const authroutes = router
module.exports = { authroutes, user_model };