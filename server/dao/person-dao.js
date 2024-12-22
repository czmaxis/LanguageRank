const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const personFolderPath = path.join(__dirname, "storage", "personList");

// Method to read an person from a file
function get(personId) {
  try {
    const filePath = path.join(personFolderPath, `${personId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadperson", message: error.message };
  }
}

// Method to write a person to a file
function create(person) {
  try {
    person.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(personFolderPath, `${person.id}.json`);
    const fileData = JSON.stringify(person);
    fs.writeFileSync(filePath, fileData, "utf8");
    return person;
  } catch (error) {
    throw { code: "failedToCreatePerson", message: error.message };
  }
}

// Method to update person in a file

function update(person) {
  try {
    const currentPerson = get(person.id);
    if (!currentPerson) return null;

    const newPerson = { ...currentPerson, ...person };
    const filePath = path.join(personFolderPath, `${person.id}.json`);
    const fileData = JSON.stringify(newPerson);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newPerson;
  } catch (error) {
    throw { code: "failedToUpdatePerson", message: error.message };
  }
}

// Method to remove a person from personList
function remove(personId) {
  try {
    const filePath = path.join(personFolderPath, `${personId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw { code: "failedToRemovePerson", message: error.message };
  }
}

// Method to list persons in a folder

function list() {
  try {
    const files = fs.readdirSync(personFolderPath);
    const personList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(personFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
    personList.sort((a, b) => new Date(a.date) - new Date(b.date));
    return personList;
  } catch (error) {
    throw { code: "failedToListPersons", message: error.message };
  }
}

// Method to list persons by languageId

function listByLanguageId(languageId) {
  const personList = list();
  return personList.filter((item) => item.languageId === languageId);
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
  listByLanguageId,
};
