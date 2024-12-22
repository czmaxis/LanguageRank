const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const languageFolderPath = path.join(__dirname, "storage", "languageList");

// Method to read an language from a file
function get(languageId) {
  try {
    const filePath = path.join(languageFolderPath, `${languageId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadLanguage", language: error.language };
  }
}

// Method to write an language to a file
function create(language) {
  try {
    const languageList = list();

    if (
      languageList.some(
        (item) => item.languageName === language.languageName
      ) &&
      languageList.some(
        (rankItem) => rankItem.languageRank === language.languageRank
      )
    ) {
      throw {
        code: "uniqueLanguageAlreadyExists",
        message: "entered language is already exist",
      };
    }

    language.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(languageFolderPath, `${language.id}.json`);
    const fileData = JSON.stringify(language);
    fs.writeFileSync(filePath, fileData, "utf8");
    return language;
  } catch (error) {
    throw { code: "failedToCreateLanguage", language: error.language };
  }
}

// Method to update language in a file

function update(language) {
  try {
    const currentLanguage = get(language.id);
    if (!currentLanguage) return null;

    if (
      language.languageName &&
      language.languageName !== currentLanguage.languageName
    ) {
      const languageList = list();
      if (
        languageList.some((item) => item.languageName === language.languageName)
      ) {
        throw {
          code: "uniqueNameAlreadyExists",
          message: "exists language with given name",
        };
      }
    }

    const newLanguage = { ...currentLanguage, ...language };
    const filePath = path.join(languageFolderPath, `${language.id}.json`);
    const fileData = JSON.stringify(newLanguage);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newLanguage;
  } catch (error) {
    throw { code: "failedToUpdateLanguage", language: error.language };
  }
}

// Method to remove an languages from a file
function remove(languageId) {
  try {
    const filePath = path.join(languageFolderPath, `${languageId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw { code: "failedToRemoveLanugage", language: error.language };
  }
}

// Method to list languages in a folder

function list() {
  try {
    const files = fs.readdirSync(languageFolderPath);
    const languageList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(languageFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
    languageList.sort((a, b) => new Date(a.date) - new Date(b.date));
    return languageList;
  } catch (error) {
    throw { code: "failedToListLanguage", message: error.message };
  }
}

// get languageMap
function getLanguageMap() {
  const languageMap = {};
  const languageList = list();
  languageList.forEach((language) => {
    languageMap[language.id] = language;
  });
  return languageMap;
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
  getLanguageMap,
};
