const express = require("express");
const dotenv = require("dotenv")
const app = express();
const cors = require('cors')
const mongoose = require('mongoose');
const { authroutes } = require("./routes/auth-routes");
const authMiddleware = require("./middleware/Auth-Middleware");
const { todoroutes } = require("./routes/todo-routes");
const PORT = process.env.PORT;
const MONGOURL = process.env.MONGO_URL

app.use(express.json());

dotenv.config()
app.use(express.json());
app.use(cors())

mongoose.connect(MONGOURL).then(() => {
    console.log("MONGO_DB Connected");
}).catch((e) => {
    console.log(e).message;
})



app.get('/',(req,res)=>{
    console.log("Server Running>>>>>>>>>");
    res.send("Express on Vercel")
})
app.use('/auth', authroutes)

app.use('/api', todoroutes)



if(process.env.NODE_ENV!=="production"){
    app.listen(3000, () => console.log("Server ready on port 3000."));
}

module.exports = app;