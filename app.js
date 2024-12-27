const express = require("express");
const app = express();
const authroutes = require("./routes/auth-routes");
const authMiddleware = require("./middleware/Auth-Middleware");
const { todoroutes } = require("./routes/todo-routes");
const PORT = 5000;
app.use(express.json());

app.use('/auth', authroutes)

app.use('/api', authMiddleware, todoroutes)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});