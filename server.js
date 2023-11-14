const http = require("node:http");

const { requestHandler } = require("./handlers/router");

const PORT = 8000;

http.createServer(requestHandler)
    .listen(PORT, () => console.log(`Web Server is listening on port ${PORT}...`));
