// const express = require("express");
// const app = express();
// const cors = require('cors')
// const mongoose = require('mongoose');
// const { authroutes } = require("./routes/auth-routes");
// const authMiddleware = require("./middleware/Auth-Middleware");
// const { todoroutes } = require("./routes/todo-routes");
// const PORT = process.env.PORT;
// const MONGOURL = process.env.MONGO_URL

// app.use(express.json());
// app.use(cors())

// mongoose.connect(MONGOURL).then(() => {
//   console.log("MONGO_DB Connected");
// }).catch((e) => {
//   console.log(e).message;
// })


// app.use(express.json());

// app.get('/',(req,res)=>{
//   console.log("Server Running>>>>>>>>>");
  
// })
// app.use('/auth', authroutes)

// app.use('/api', authMiddleware, todoroutes)

// app.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}`);
// });