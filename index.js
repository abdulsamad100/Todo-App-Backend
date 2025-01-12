const express = require("express");
const app = express();
const dotenv = require("dotenv")

dotenv.config()

app.get("/", (req, res) => res.send("Express on Vercel"));

if(process.env.NODE_ENV!=="production"){
    app.listen(3000, () => console.log("Server ready on port 3000."));
}

module.exports = app;