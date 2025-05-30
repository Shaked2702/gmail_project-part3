//each user has a unique id.
let idCounter=0
//array to store the users.
const users= []
//function to get user details by id.
const getUser = (id) =>
    users.find(a=>a.id ===id)
//emails are case insensitive, so we convert them to lower case before comparing.
const getUserByEmail = (email) =>
    users.find(a => a.email.toLowerCase() === email.toLowerCase());
//function to create a new user.
const createUser = (first_name,last_name,birthDay,gender,email,password,phone_number,image=null) => {
    const newUser = {
        id: ++idCounter,
        first_name,
        last_name,
        birthDay,
        gender,
        email: email.toLowerCase(), //case insensitive
        password,
        phone_number,
        image
    }
    //enter the new user in the array
    //and return the new user
    users.push(newUser)
    return newUser
}

module.exports = {
    getUser,
    createUser,
    getUserByEmail
}