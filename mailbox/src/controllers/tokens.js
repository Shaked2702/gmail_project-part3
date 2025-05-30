//import user form models
const usersModelsPath = require('../models/users')

exports.login = (req, res) => {
    //getting in body the data to checl user
    const {email, password} = req.body

    // Check for required fields
    if (!email || !password ) {
        return res.status(400).json({ error: 'Must give email and password' })
    }
    //check if the user exists
    const user = usersModelsPath.getUserByEmail(email);
    if (!user || user.password !== password) {
        return res.status(400).json({ error: 'Email or password is incorrect' })
    }

    // Use user ID as token
    const token = user.id.toString()
    // Return success response with token
    res.status(200).json({ token }).end()
}
