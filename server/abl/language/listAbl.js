const languageDao = require("../../dao/language-dao.js");

async function ListAbl(req, res) {
  try {
    const languageList = languageDao.list();
    res.json(languageList);
  } catch (e) {
    res.status(500).json({ language: e.language });
  }
}

module.exports = ListAbl;
