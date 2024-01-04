const { URL } = require("node:url");

const { homeHandler, searchCatsGetHandler } = require("./home");
const { staticFilesHandler } = require("./static-files");
const { addBreedGetHandler, addBreedPostHandler } = require("./breeds");
const {
    addCatGetHandler,
    addCatPostHandler,
    updateCatGetHandler,
    adoptCatGetHandler,
    adoptCatPostHandler,
    updateCatPostHandler
} = require("./cats");
const web = require("../web");

const BASE_URL = "http://localhost";

const ROUTES = {
    "/content": {
        "GET": staticFilesHandler,
        partialMatch: true
    },
    "/cats/add-breed": {
        "GET": addBreedGetHandler,
        "POST": addBreedPostHandler
    },
    "/cats/add-cat": {
        "GET": addCatGetHandler,
        "POST": addCatPostHandler
    },
    "/cats/edit": {
        "GET": updateCatGetHandler,
        "POST": updateCatPostHandler
    },
    "/cats/adopt": {
        "GET": adoptCatGetHandler,
        "POST": adoptCatPostHandler
    },
    "/cats/search": {
        "GET": searchCatsGetHandler
    },
    "/": {
        "GET": homeHandler
    }
};

module.exports.requestHandler = async (req, res) => {
    const url = new URL(req.url, BASE_URL);
    const method = req.method;

    const urlPath = Object.keys(ROUTES)
        .find(route => (ROUTES[route].partialMatch && url.pathname.startsWith(route)) || url.pathname === route);
    const routeResult = ROUTES[urlPath];

    if (!routeResult) {
        return web.renderError(res, 404, "No route found!");
    }

    const routeHandler = routeResult[method];

    if (!routeHandler) {
        return web.renderError(res, 404, "No handler found for this request method!");
    }

    await routeHandler(req, res, url);
};
