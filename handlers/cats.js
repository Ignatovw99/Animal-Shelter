const web = require("../web");
const db = require("../db");
const { moveFileToContentDirectory } = require("../utils");

module.exports.addCatGetHandler = async (req, res) => {
    try {
        const breeds = await db.findAllBreeds();
        const catBreedOptions = breeds.map(async (breed) => {
            return await web.initializeTemplate("partials/cat-breed-option", { breed, isSelected: "" });
        });

        await web.renderTemplate(res, "add-cat", {
            catBreeds: await Promise.all(catBreedOptions)
        });
    } catch (error) {
        await web.renderError(res, 500, "Something went wrong!");
    }
};

module.exports.addCatPostHandler = async (req, res) => {
    try {
        const [fields, files] = await web.getMultipartFormData(req);

        const catImage = files.upload;
        await moveFileToContentDirectory(catImage);

        const cat = {
            ...fields,
            image: catImage.originalFilename
        };
        await db.createCat(cat);
        web.redirect(res, "/");
    } catch (error) {
        await web.renderError(res, 500, "Something went wrong!");
    }
};

module.exports.updateCatGetHandler = async (req, res, url) => {
    try {
        const catId = Number(web.getLastPartOfUrlPath(url));
        const cat = await db.findCatById(catId);
        if (!cat) {
            return await web.renderError(res, 404, "Cat not found!");
        }

        const breeds = await db.findAllBreeds();
        const catBreedOptions = breeds.map(async (breed) => {
            return await web.initializeTemplate("partials/cat-breed-option", { 
                breed,
                isSelected: cat.breed === breed ? "selected" : ""
            });
        });

        await web.renderTemplate(res, "edit-cat", {
            id: cat.id,
            name: cat.name,
            description: cat.description,
            catBreeds: await Promise.all(catBreedOptions)
        });
    } catch (error) {
        await web.renderError(res, 500, "Something went wrong!");
    }
};

module.exports.updateCatPostHandler = async (req, res, url) => {
    try {
        const catId = Number(web.getLastPartOfUrlPath(url));
        const [fields, files] = await web.getMultipartFormData(req);

        const catImage = files.upload;
        await moveFileToContentDirectory(catImage);

        const cat = {
            ...fields,
            image: catImage.originalFilename
        };
        await db.updateCat(catId, cat);

        web.redirect(res, "/");
    } catch (error) {
        await web.renderError(res, 500, "Something went wrong!");
    }
};

module.exports.adoptCatGetHandler = async (req, res, url) => {
    try {
        const catId = Number(web.getLastPartOfUrlPath(url));
        const cat = await db.findCatById(catId);
        if (!cat) {
            return await web.renderError(res, 404, "Cat not found!");
        }
        await web.renderTemplate(res, "cat-shelter", {
            id: cat.id,
            name: cat.name,
            description: cat.description,
            breed: cat.breed,
            image: cat.image
        });
    } catch (error) {
        await web.renderError(res, 500, "Something went wrong!");
    }
};

module.exports.adoptCatPostHandler = async (req, res, url) => {
    try {
        const catId = Number(web.getLastPartOfUrlPath(url));
        await db.deleteCatById(catId);
        web.redirect(res, "/");
    } catch (error) {
        await web.renderError(res, 500, "Something went wrong!");
    }
};
