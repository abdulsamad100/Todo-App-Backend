const express = require("express");
const fs = require("fs");
const path = require('path');
const router = express.Router();
const Joi = require('joi');
require('dotenv').config();
const { v4: uuidv4 } = require("uuid");
const { chkFile, appendFileData, getFileData, addFileData } = require("../utils/helper");
const ENUMS = require("../utils/AllVariable");
const { log } = require("console");

router.post("/todo/add", (req, res) => {
    const wholepath = path.join(__dirname, "/files", "todo.json")

    if (!chkFile("todo.json")) {
        const data = { data: [] }
        fs.writeFileSync(wholepath, JSON.stringify(data))
    }

    const data_to_add = req.body;

    const Schema = Joi.object({
        title: Joi.string().min(1).required(),
        description: Joi.string().min(1).required(),
    })

    const validate = Schema.validate(data_to_add)

    if (validate.error) {
        return res.status(400).json({ message: validate.error.message })
    }

    const createdBy = req.user.id
    const data = ({ ...req.body, todo_id: uuidv4(), createdBy, createdAt: new Date() })

    appendFileData(ENUMS.todoPath, data)

    res.json({ message: "todo Added" })
})

router.get("/todo/mytodo", (req, res) => {
    const data = getFileData(ENUMS.todoPath);
    console.log(req.user.id);

    const userTodos = data.data.filter((d) => d.createdBy === req.user.id);
    res.json({ data: userTodos });
})

router.delete("/todo/delete/:id", (req, res) => {
    const todoId = req.params.id;
    const currentUser = req.user.id;

    const data = getFileData(ENUMS.todoPath);

    if (!data || !data.data) {
        return res.status(404).json({ message: "No todos found." });
    }

    const todoIndex = data.data.findIndex((todo) =>
        todo.todo_id === todoId && todo.created_by === currentUser.id
    );

    if (todoIndex === -1) {
        return res.status(404).json({ message: "Todo not found or you do not have permission to delete this todo." });
    }

    data.data.splice(todoIndex, 1);

    addFileData(ENUMS.todoPath, data.data);

    res.json({ message: "Todo deleted successfully." });
});

router.put("/todo/update/:id", (req, res) => {
    const todoId = req.params.id;
    const currentUser = req.user.id;

    const Schema = Joi.object({
        title: Joi.string().min(1).required(),
        description: Joi.string().min(1).required(),
    })

    const validate = Schema.validate(req.body)
    if (validate.error) {
        const errorMsg = validate.error.message
        console.log(errorMsg);
        res.json({ message: errorMsg })
    }
    // Fetch existing todos
    const data = getFileData(ENUMS.todoPath);

    if (!data || !data.data) {
        return res.status(404).json({ message: "No todos found." });
    }
    

    const todoIndex = data.data.findIndex((todo) =>
        todo.todo_id === todoId && todo.createdBy === currentUser // Check if todo_id matches and created_by equals currentUser.id
    );

    if (todoIndex === -1) {
        return res.status(404).json({ message: "Todo not found or you do not have permission to update this todo." });
    }

    const updatedTodo = { ...data.data[todoIndex], ...req.body ,lastmodifiedAt: new Date()}; // Merge the existing todo with the new values from req.body

    data.data[todoIndex] = updatedTodo; // Update the todo in the array

    // Update the file with the modified data
    addFileData(ENUMS.todoPath, data.data);

    res.json({ message: "Todo updated successfully.", updatedTodo });
});


const todoroutes = router
module.exports = { todoroutes }