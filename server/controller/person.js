const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/person/getAbl");
const ListAbl = require("../abl/person/listAbl");
const CreateAbl = require("../abl/person/createAbl");
const UpdateAbl = require("../abl/person/updateAbl");
const DeleteAbl = require("../abl/person/deleteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;
