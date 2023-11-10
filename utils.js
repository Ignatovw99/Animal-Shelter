const path = require("node:path");
const fs = require("node:fs/promises");

module.exports.moveFileToContentDirectory = async (file) => {
    const fileTempPath = file.filepath;
    const fileDestinationPath = path.normalize(path.join(__dirname, "./content/images", file.originalFilename));
    await fs.rename(fileTempPath, fileDestinationPath);
};
