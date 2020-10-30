const express = require("express");
const morgan = require("morgan");
const userRouter = require("./users/userRouter");
const postRouter = require("./posts/postRouter");

const server = express();

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use(express.json());
server.use(morgan("dev"));
server.use("/api/users", userRouter);
server.use("/api/posts", postRouter);
// server.use((err, req, res, next) => {
//   res.status(500).json({ message: "there was a problem" });
// });

server.use("*", (req, res) => {
  res.status(404).json({ message: "not found" });
});

module.exports = server;
