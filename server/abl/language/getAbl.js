const Ajv = require("ajv");
const ajv = new Ajv();
const languageDao = require("../../dao/language-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
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
        language: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // read language by given id
    const language = languageDao.get(reqParams.id);
    if (!language) {
      res.status(404).json({
        code: "languageNotFound",
        language: `Language with id ${reqParams.id} not found`,
      });
      return;
    }

    // return properly filled dtoOut
    res.json(language);
  } catch (e) {
    res.status(500).json({ language: e.language });
  }
}

module.exports = GetAbl;
