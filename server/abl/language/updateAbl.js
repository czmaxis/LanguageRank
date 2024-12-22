const Ajv = require("ajv");
const ajv = new Ajv();

const languageDao = require("../../dao/language-dao.js");

const schema = {
  type: "object",
  properties: {
    languageName: { type: "string" },
    languageRank: { type: "string" },
    assessment: { type: "string" },
    languageId: { type: "string" },
    id: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
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

    // update language in persistent storage
    let updatedLanguage;
    try {
      updatedLanguage = languageDao.update(language);
    } catch (e) {
      res.status(400).json({
        ...e,
      });
      return;
    }
    if (!updatedLanguage) {
      res.status(404).json({
        code: "languageNotFound",
        language: `Category with id ${language.id} not found`,
      });
      return;
    }

    // return properly filled dtoOut
    res.json(updatedLanguage);
  } catch (e) {
    res.status(500).json({ language: e.language });
  }
}

module.exports = UpdateAbl;
