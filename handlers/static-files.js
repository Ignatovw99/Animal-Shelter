const fs = require("node:fs/promises");
const path = require("node:path");

const contentType = {
    "css": "text/css",
    "ico": "image/ico",
    "jpg": "image/jpg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    default: "text/plain"
};

function getContentType(pathname) {
    const urlExtension = Object.keys(contentType)
        .find(fileExtension => pathname.endsWith(fileExtension));
    if (!urlExtension) {
        return contentType.default;
    }
    return contentType[urlExtension];
}

module.exports.staticFilesHandler = async (req, res, url) => {
    const pathname = decodeURI(url.pathname);
    try {
        const filePath = path.normalize(path.join(__dirname, "../", pathname));
        const fileData = await fs.readFile(filePath);
        res.writeHead(200, {
            "Content-Type": getContentType(pathname)
        });
        res.write(fileData);
        res.end();
    } catch (error) {
        res.writeHead(404, {
            "Content-Type": contentType.default
        });
        res.write("404 - Not Found");
        res.end();
    }
};