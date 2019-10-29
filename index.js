"use strict";

const port = 1337;
const express = require("express");
const app = express();
const routeMicrobits = require("./route/microbits.js");
const path = require("path");
const middleware = require("./middleware/index.js");

app.use(middleware.logIncomingToConsole);

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use("/", (routeMicrobits));

app.listen(port, () => {
    console.info(`Server is listening on ${port}`);
});
