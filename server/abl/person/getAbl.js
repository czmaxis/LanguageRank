const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const personDao = require("../../dao/person-dao.js");
const languageDao = require("../../dao/language-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function GetAbl(req, res) {
  try {
    // get request query or body
    const reqParams = req.query?.id ? req.query : req.body;

    // validate input
    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // read person by given id
    const person = personDao.get(reqParams.id);
    if (!person) {
      res.status(404).json({
        code: "personNotFound",
        message: `Person ${reqParams.id} not found`,
      });
      return;
    }

    // get related language
    const language = languageDao.get(person.languageId);
    person.language = language;

    // return properly filled dtoOut
    res.json(person);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetAbl;
