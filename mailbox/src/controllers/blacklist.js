// Imporant note:
// Using ":/id" but given url. Meaning req contains in the "id" a "url" and not an id.

const Blacklist = require('../models/blacklist')

exports.addUrl = (req, res) => {
    const { id } = req.body
    // Check for required fields
    if (!id) {
        return res.status(400).json({ message: 'Field: <id> is needed' })
    }
    // Add the URL to the blacklist - sending lambda function to handle the response
    Blacklist.addUrl(id, (addUrlOutput) => {
        // Output 201 Created or 400 Bad Request (for invalid url syntax)
        if (addUrlOutput.status === 201) {
            return res.status(201).location(`/api/blacklist/${id}`).end()
        } else if (addUrlOutput.status === 400 ) { // 400 Bad Request
            return res.status(400).json({ error: 'Bad Request Invalid Url' })
        } else { // 502 Bad Gateway (only possibility) - connection problem between server and external server
            return res.status(502).json({ error: 'Bad Gateway' })
        }
    })
}

exports.deleteUrl = (req, res) => {
    // Call the deleteUrl function from the Blacklist model - with a lambda function to handle the output
    Blacklist.deleteUrl(req.params.id, (deleteUrlOutput) => {
        // Possibilities: 204 No Content, 400 Bad Request, 404 Not Found, 502 Bad Gateway
        if (deleteUrlOutput.status === 204) {
            return res.status(204).end() // No Content
        } else if (deleteUrlOutput.status === 400) {
            return res.status(400).json({ error: 'Bad Request Invalid Url' }) // Bad Request
        } else if (deleteUrlOutput.status === 404) {
            return res.status(404).json({ error: 'Url Not Found' }) // Not Found
        } else { // 502 Bad Gateway
            return res.status(502).json({ error: 'Bad Gateway' })
        }
    })
}
