const path = require("node:path");
const fs = require("node:fs/promises");
const { createReadStream } = require("node:fs");
const formidable = require("formidable");

const TEMPLATE_VIEW_PATH = "./views/"

module.exports.renderView = (res, viewName, statusCode = 200) => {
    const viewFilePath = path.normalize(path.join(__dirname, TEMPLATE_VIEW_PATH + viewName + ".html"));

    res.writeHead(statusCode, {
        "Content-Type": "text/html"
    });

    createReadStream(viewFilePath)
        .on("error", (err) => {
            web.renderError(res, 500, "Something went wrong!");
        })
        .pipe(res);
};

module.exports.initializeTemplate = async (templateName, options) => {
    const templateFilePath = path.normalize(path.join(__dirname, TEMPLATE_VIEW_PATH + templateName + ".html"));
    const templateRawData = await fs.readFile(templateFilePath, { encoding: "utf-8" });

    const templateOptions = options || {};
    const template = Object.entries(templateOptions)
        .reduce((templateAccumulator, [property, value]) => {
            return templateAccumulator.replaceAll(`{{${property}}}`, value);
        }, templateRawData);

    return template;
};

module.exports.renderTemplate = async (res, templateName, options, statusCode = 200) => {
    const template = await this.initializeTemplate(templateName, options);
    res.writeHead(statusCode, {
        "Content-Type": "text/html"
    });
    res.write(template);
    res.end();
};

module.exports.redirect = (res, to) => {
    res.writeHead(302, {
        "Location": to
    });
    res.end();
};

module.exports.renderError = async (res, statusCode, message) => {
    await this.renderTemplate(res, "error", { statusCode, message }, statusCode);
};

module.exports.getURLEncodedFormData = (req) => {
    return new Promise((resolve, reject) => {
        const data = [];
        req.on("error", (error) => reject(error));
        req.on("data", (chunk) => data.push(chunk));
        req.on("end", () => {
            const textData = Buffer.concat(data).toString();
            const formData = new URLSearchParams(textData);
            resolve(formData);
        });
    });
};

module.exports.getMultipartFormData = (req) => {
    return new Promise(async (resolve, reject) => {
        const form = formidable.formidable();
        const fields = {};
        const files = {};

        form.on("error", function (error) {
            reject(error);
        });
        form.on('field', (field, value) => fields[field] = value);
        form.on('file', (field, file) => files[field] = file);

        await form.parse(req);
        resolve([fields, files]);
    });
};

module.exports.getLastPartOfUrlPath = (url) => {
    const urlTokens = url.pathname.split("/");
    return urlTokens[urlTokens.length - 1];
};
