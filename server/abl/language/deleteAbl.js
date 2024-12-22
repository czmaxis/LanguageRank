const Ajv = require("ajv");
const ajv = new Ajv();
const languageDao = require("../../dao/language-dao.js");
const personDao = require("../../dao/person-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function DeleteAbl(req, res) {
  try {
    const reqParams = req.body;

    // validate input
    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        category: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // check there is no person related to given language
    const personList = personDao.listByLanguageId(reqParams.id);
    if (personList.length) {
      res.status(400).json({
        code: "languageWithPersons",
        language: "language has related persons and cannot be deleted",
        validationError: ajv.errors,
      });
      return;
    }

    // remove language from persistant storage
    languageDao.remove(reqParams.id);

    // return properly filled dtoOut
    res.json({});
  } catch (e) {
    res.status(500).json({ language: e.language });
  }
}

module.exports = DeleteAbl;
