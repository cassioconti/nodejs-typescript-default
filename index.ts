import express = require("express");
const app = express();

app.get("/", (request, response) => {
    response.send("Hello World, Node.js!");
});

app.listen(process.env.PORT || 8080);
