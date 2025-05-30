// Exprees js import
const express = require('express')
// Variable app of type express
var app = express()
//user is the route users, will be used to handle functions
const user = require('./routes/users')
//import the user route
const token = require('./routes/tokens')
const blacklist = require('./routes/blacklist')
const label = require('./routes/labels')
const mail = require('./routes/mails')

app.use(express.json())

app.use('/api/users', user)
app.use('/api/tokens', token)
app.use('/api/blacklist', blacklist)
app.use('/api/labels', label)
app.use('/api/mails', mail)

app.use((req, res) => {
    res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});


app.listen(3000)  
