const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/language/getAbl");
const ListAbl = require("../abl/language/listAbl");
const CreateAbl = require("../abl/language/createAbl");
const UpdateAbl = require("../abl/language/updateAbl");
const DeleteAbl = require("../abl/language/deleteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;
