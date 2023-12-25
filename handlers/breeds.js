const web = require("../web");
const { createBreed } = require("../db");

module.exports.addBreedGetHandler = (req, res) => web.renderView(res, "add-breed");

module.exports.addBreedPostHandler = async (req, res) => {
    try {
        const formData = await web.getURLEncodedFormData(req);
        const breed = formData.get("breed");
        await createBreed(breed);
        web.redirect(res, "/");
    } catch (error) {
        await web.renderError(res, 500, "Something went wrong!");
    }
};
