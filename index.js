const express = require("express");
const cors = require("cors");
const postRouter = require("./posts/postRouter");
const userRouter = require("./users/userRouter");
const logger = require("./middleware/logger");

const server = express();
const port = 5000;

server.use(express.json());
server.use(cors());
server.use(logger({format: "long"}))

server.use("/api/users", userRouter);
server.use("/api/users/:id/posts", postRouter);

server.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({
        message: "ERROR ERROR"
    })
})

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
});

