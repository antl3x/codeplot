import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const expressApp = express();
const expressServer = createServer(expressApp);

expressApp.get("/", (req, res) => {
  res.json({
    status: "ok",
    version: process.env.npm_package_version,
  });
});

const ioServer = new Server(expressServer);

expressServer.listen(3000, () => {
  console.log(
    `Server Running @ ${process.env.TARGET + ":" + process.env.PORT_CONTAINER}`,
  );
});

ioServer.on("connection", () => {
  console.log("a user connected");
});
