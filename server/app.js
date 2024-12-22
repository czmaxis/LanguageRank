const express = require("express");
const app = express();
const port = 8000;

const personController = require("./controller/person");
const languageController = require("./controller/language");

app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // podpora pro application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/person", personController);
app.use("/language", languageController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
