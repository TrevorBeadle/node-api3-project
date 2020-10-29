const express = require("express");
const morgan = require("morgan");
const userRouter = require("./users/userRouter");

const server = express();

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use(express.json());
server.use(morgan("dev"));
server.use("/api/users", userRouter);

server.get("*", (req, res) => {
  res.status(404).json({ message: "not found" });
});

server.use((error, req, res, next) => {
  res.status(500).json({ message: error });
});

module.exports = server;
