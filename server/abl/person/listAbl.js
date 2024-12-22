const personDao = require("../../dao/person-dao.js");
const languageDao = require("../../dao/language-dao.js");

async function ListAbl(req, res) {
  try {
    const personList = personDao.list();

    // get language map
    const languageMap = languageDao.getLanguageMap();

    // add language to each person
    personList.forEach((person) => {
      person.language = languageMap[person.languageId];
    });

    // return properly filled dtoOut
    res.json(personList);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;
