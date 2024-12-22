const Ajv = require("ajv");
const ajv = new Ajv();

const languageDao = require("../../dao/language-dao.js");

const schema = {
  type: "object",
  properties: {
    languageName: { type: "string" },
    languageRank: { type: "string" },
  },
  required: ["languageName", "languageRank"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let language = req.body;

    // validate input
    const valid = ajv.validate(schema, language);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        language: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // store language to a persistant storage
    try {
      language = languageDao.create(language);
    } catch (e) {
      res.status(400).json({
        ...e,
      });
      return;
    }

    // return properly filled dtoOut
    res.json(language);
  } catch (e) {
    res.status(500).json({ language: e.language });
  }
}

module.exports = CreateAbl;
