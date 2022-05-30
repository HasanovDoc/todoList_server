const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'test/plain' });
    res.end('hi');
});


server.listen(5000, () => {
    console.log("The server is running");
});