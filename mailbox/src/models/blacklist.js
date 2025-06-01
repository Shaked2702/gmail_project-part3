const net = require('net'); // Import net module for TCP socket communication

const HOST = '127.0.0.1';
const PORT = 9160;

// Function to create a TCP socket connection to an external server
// Note: Callback function is a lambda function handles add/delete/check.
function createSocket(callback) {
    const socket = new net.Socket(); // Socket creation

    socket.connect(PORT, HOST, () => { // Bind to ip:port
        callback(socket);
    });
    socket.on('error', (err) => {
        callback(err);
    });
}

function closeSocket(socket) {
  if (socket && !socket.destroyed) {
    socket.end();
  }
}

// AddUrl function to add URL to the blacklist
// Object returned: 
// { status: 201 } for success, 
// { status: 400 } for bad request (invalid URL syntax), 
// { status: 502 } for server connection error
// callback2 is a lambda function to handle the response
function addUrl(url, callback2) {
    // Create socket connection - create matching lambda for addUrl
    createSocket((socket) => {
        if (!socket) {
            return { status: 502 }; // Server connection error
        }
        socket.write(`POST ${url}\n`); // Send POST request with URL \n terminated
        socket.on('data', (data) => { // Lambda to handle data received -> output
            const response = data.toString().trim(); // Remove whitespace and \n characters from start and end

            if (response.includes("201")) {
                callback2({ status: 201 }); // URL added successfully
            } else {
                callback2({ status: 400 }); // Bad Request (invalid URL syntax)
            }
            closeSocket(socket); // Close the socket after processing data
            // Note: no 'return' syntax befire each callback2 to enable closeSocket at the end.
        })
    })
}

// DeleteUrl function to delete URL from the blacklist
// Object returned:
// { status: 204 } for success,
// { status: 400 } for bad request,
// { status: 404 } for not found,
// { status: 502 } for server connection error
// callback2 is a lambda function to handle the response
function deleteUrl(url, callback2) {
    createSocket((socket) => {
        if (!socket) {
            return callback2({ status: 502 }); // Server connection error
        }

        socket.write(`DELETE ${url}\n`); // Send DELETE request with URL \n terminated

        socket.on('data', (data) => { // Lambda to handle data received -> output
            const response = data.toString().trim(); // Remove whitespace and \n characters from start and end

            if (response.includes("204")) { // URL deleted successfully
                callback2({ status: 204 });
            } else if (response.includes("400")) { // Bad Request
                callback2({ status: 400 }); 
            } else { // Not Found - only remaining possibility
                callback2({ status: 404 });
            }
            closeSocket(socket); // Close the socket after processing data
            // Note: no 'return' syntax befire each callback2 to enable closeSocket at the end.
        })
    })
}

// Function for internal use only (Mail epic)
// Check if an *Array of URLs (strings)* contains blacklisted URL
// Returns an object like { error: false, blacklisted: [...] }.
// Error is true if there is a connection problem with the blacklist external server.
// blacklisted is an array of URLs that are blacklisted.
// The empty_callback is to handle the asynchronous nature of the function.
function checkUrlSync(url_input,
    closing_callback = (obj) => { return obj; }) {

    let blacklisted = false; // Array to hold blacklisted URLs
    let error = false; // Flag to indicate if there was an error
    let responseFlag = false; // Counter for responses received
    let buffer = ''; // Stores the incoming data from the socket

    createSocket((socket) => {
        if (!socket) {
            console.log(`Error: Could not connect to ${HOST}:${PORT}`); // Log connection error
            error = true;
            return closing_callback({ error, blacklisted });
        }
        // Command tells socket to send TCP packet immediately without waiting
        console.log(`Connected to ${HOST}:${PORT}`); // Log connection success////////////////////////////
        // To stop after "total" real responses (and not merged responses)
        
        socket.on('data', (data) => {
            buffer += data.toString();
            console.log(`Received data: ${buffer}`); // Log received data for debugging//////////////////////////
            // Try to extract full responses from the buffer
            while (true) {
                // Match one complete response using known patterns
                const match = buffer.match(/^(?:200 Ok\n\n(true true|true false|false)\n|400 Bad Request\n)/);
                console.log(`Match result: ${match}`); // Log match result for debugging////////////////////////////
                if (!match) {
                    // Not enough data for a full message yet
                    break;
                }

                const fullMsg = match[0]; // Holds full message
                const result = match[1]; // true true, true false, false — or undefined if Bad Request
                // match[1] knows the data because "(...)" in regex

                // Process the message
                if (fullMsg.startsWith('400')) {
                    error = true;
                } else if (result === 'false' || result === 'true false') { 
                    // Not blacklisted — do nothing
                    error = false;
                } else { 
                    // Blacklisted URL
                    error = false;
                    blacklisted = true;
                }

                responseFlag = true; // Set flag to indicate a response was processed
                console.log(`Processed response ${responseFlag} : ${fullMsg}`); // Log processed response for debugging
                // Remove processed message from buffer
                buffer = buffer.slice(fullMsg.length); // Redundant atm - changed to single URL input
                console.log(`Buffer after processing a slice: ${buffer}`); // Log buffer state for debugging
                if (responseFlag) {
                    closeSocket(socket);
                    closing_callback({ error, blacklisted });
                    break;
                }
            }
        });
        
        // Send GET request with URL \n terminated
        socket.write(`GET ${url_input}\n`);

    }) // End of Socket lambda
}

// Wrapper of checkUrlSync to return a Promise.
async function checkUrl(url_input) {
    return await new Promise((resolve, reject) => {
        checkUrlSync(url_input, (ret_obj) => {
            if (ret_obj) resolve(ret_obj);
            else reject(new Error("No result returned"));
        });
    });
}


module.exports = {
    addUrl,
    deleteUrl,
    checkUrl
}