// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Define the server port
const PORT = 3000;

// Create the HTTP server
const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        // Serve the HTML form
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
    } else if (req.method === 'POST' && req.url === '/submit') {
        // Collect data from the POST request
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            // Extract the phone number from the POST data
            const phoneNumber = new URLSearchParams(body).get('phone');
            if (phoneNumber) {
                // Write the phone number to a file
                fs.appendFile('phoneNumbers.txt', phoneNumber + '\n', err => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Error saving phone number');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end('Phone number saved successfully!');
                    }
                });
            } else {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Phone number is required');
            }
        });
    } else {
        // Handle 404 - Not Found
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
