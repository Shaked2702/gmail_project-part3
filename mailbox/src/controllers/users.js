//import user form models
const Users = require('../models/users')

exports.getUserById = (req, res) => {
    //using models to get the user by id
    const user = Users.getUser(parseInt(req.params.id))
    //if user is not found, return 404
    if (!user) {
        return res.status(404).json({ error: 'User not found' })
    }
    //return the user details witout the password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword); // Default response is 200 OK
}
exports.createUser = async (req, res) => {
    const { first_name, last_name,birthDay,gender, email, password, phone_number, image = null } = req.body

    // Check for required fields
    if (!first_name || !last_name || !birthDay || !gender || !email || !password || !phone_number) {
        return res.status(400).json({ error: 'In order so sign up must give: first name, last name,birthDay,gender-[male female od other],email,password,phone number,image in optional' })
    }

    // Email format check
    const email_regex = /^[^\s@]{6,30}@[^\s@]+\.[^\s@]+$/;
    if (!email_regex.test(email)) {
        return res.status(400).json({  error: 'Email format is invalid, most be 6-30 long.' })
    }

    // Check if email already exists
    const existingUser = Users.getUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({  error: 'Email already exists' })
    }

    // Phone number format check (10 digits)
    const phone_regex = /^05\d{8}$/;
    if (!phone_regex.test(phone_number)) {
        return res.status(400).json({ error: 'Phone number must be valid' })
    }

    // Birthdate format check (YYYY-MM-DD)
    const birthDay_regex = /^\d{4}-\d{2}-\d{2}$/
    if (!birthDay_regex.test(birthDay)) {
        return res.status(400).json({ error: 'Birth date must be in YYYY-MM-DD format' })
    }
    // Convert birthDay to Date object and check validity
    const birthDate = new Date(birthDay);
    
    if (isNaN(birthDate.getTime())) {
        return res.status(400).json({ error: 'Invalid birth date' });
    }
    
    //get the current date
    const today= new Date();
    //get the year of the birth date
    const year = birthDate.getFullYear();
    if( today.getFullYear() - year < 0 || today.getFullYear() - year > 120) {
        return res.status(400).json({ error: 'Birth date must be a valid date' });
    }

    //check if gender is valid
    if(gender!=='male' && gender!='female' && gender!='other') {
        return res.status(400).json({ error: 'Gender invalid, must be male female of other' });
    }
    //check if the password is strong enough
    const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
    if (!password_regex.test(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character' })
    }
    // Create the user
    const newUser = Users.createUser(first_name, last_name,birthDay,gender ,email, password, phone_number, image)
    // Return success response
    res.status(201).location(`/api/users/${newUser.id}`).end()
}
