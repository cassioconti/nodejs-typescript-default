import express = require('express');
let app = express();

app.get('/', function (request, response) {
    response.send('Hello World, Node.js!');
});

app.listen(3000);