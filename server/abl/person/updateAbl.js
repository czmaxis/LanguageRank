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
    name: { type: "string" },
    surname: { type: "string" },
    birthDate: { type: "string", format: "date-time" },
    workPosition: { type: "string" },
    personId: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
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

    // update person in database
    const updatedPerson = personDao.update(person);

    // check if languageId exists
    const language = languageDao.get(updatedPerson.languageId);
    if (!language) {
      res.status(400).json({
        code: "languageDoesNotExist",
        message: `Language with id ${updatedPerson.languageId} does not exist`,
        validationError: ajv.errors,
      });
      return;
    }

    if (!updatedPerson) {
      res.status(404).json({
        code: "personNotFound",
        message: `Person ${person.id} not found`,
      });
      return;
    }

    // return properly filled dtoOut
    updatedPerson.language = language;
    res.json(updatedPerson);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;
