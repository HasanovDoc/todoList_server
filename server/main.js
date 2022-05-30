const html_url = require('../client/index.html');
const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'test/html' });
    res.end(``);
});


server.listen(5000, () => {
    console.log("The server is running");
});