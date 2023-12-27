const web = require("../web");
const db = require("../db");

function initializeCatsListTemplate(cats) {
    const catListItems = cats.map(async (cat) => {
        const templateOptions = {
            "name": cat.name,
            "id": cat.id,
            "image": cat.image,
            "description": cat.description,
            "breed": cat.breed
        };
        return await web.initializeTemplate("partials/cat-list-item", templateOptions);
    });
    return Promise.all(catListItems);
}

module.exports.homeHandler = async (req, res) => {
    try {
        const cats = await db.findAllCats();
        await web.renderTemplate(res, "home/index", {
            "cats": await initializeCatsListTemplate(cats)
        });
    } catch (error) {
        await web.renderError(res, 500, "Something went wrong!");
    }
};

module.exports.searchCatsGetHandler = async (req, res, url) => {
    try {
        const searchParams = url.searchParams;
        const search = searchParams.get("query");
        const catsResult = await db.findAllCatsByName(search);
        await web.renderTemplate(res, "home/index", {
            "cats": await initializeCatsListTemplate(catsResult)
        });
    } catch (error) {
        await web.renderError(res, 500, "Something went wrong!");
    }
};
