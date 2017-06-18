import express = require("express");

import { EntryPoint } from "./entry-point";
import { HttpsOnly } from "./https-only";

const app = express();

app.use(new HttpsOnly().filter);

app.use(express.static("static_site"));

app.get("/hello", new EntryPoint().handleRequest);

const listener = app.listen(process.env.PORT || 8080);
console.log("Listening on port " + listener.address().port);
