const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const languageDao = require("../../dao/language-dao.js");
const personDao = require("../../dao/person-dao.js");

const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    surname: { type: "string" },
    birthDate: { type: "string", format: "date-time" },
    workPosition: { type: "string" },
    languageId: { type: "string" },
    assessment: { type: "string" },
  },
  required: ["name", "surname", "birthDate", "workPosition", "languageId"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let person = req.body;

    // validate input
    const valid = ajv.validate(schema, person);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // check if languageId exists
    const language = languageDao.get(person.languageId);

    if (!language) {
      res.status(400).json({
        code: "languageDoesNotExist",
        message: `language with id ${person.languageId} does not exist`,
        validationError: ajv.errors,
      });
      return;
    }

    // store person to persistent storage
    person = personDao.create(person);
    person.language = language;

    // return properly filled dtoOut
    res.json(person);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;
