import express = require("express");
const app = express();

app.use(express.static("static_site"));

app.get("/hello", (request, response) => {
    response.send("Hello World, Node.js!");
});

app.listen(process.env.PORT || 8080);
