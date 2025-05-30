// File of model for mails

// Set a unique counter id for each mail.
let idCounter = 0
// Set an array to store the mails.
const mails = []

// Function to create a new mail.
const createMail = ( user_id, sender_email, receivers_emails, subject, body, is_opened) => {
    const newMail = {
        id: ++idCounter,
        user_id,
        sender_email: sender_email.toLowerCase(), // normalize for matching
        receivers_emails: receivers_emails.map(email => email.toLowerCase()), // normalize for matching, 
        subject,
        body,
        created_at: new Date().toISOString(), // Store creation date in ISO format
        labels:[], // Initially empty labels array
        is_opened,          
        is_starred: false   
    };
    mails.unshift(newMail)
    return newMail
};  

// Function to get mails by user ID.
const getMailsByUser = (user_id) => {
    // Filter mails by user_id with a maximum of 50 results
    return mails.filter(mail => mail.user_id === user_id).slice(0, 50);
}

// Function to get a mail by its ID.
const getMailById = (id) => {
    // Find mail by id
    return mails.find(mail => mail.id === id);
}

// Function to delete a mail by its ID.
const deleteMailById = (id) => {
    // Find index of mail in mails array
    const index = mails.findIndex(cur_mail => cur_mail.id === id);
    // If mail not found, return null
    if (index === -1) {
        return null;
    }
    // Remove mail from array
    const deletedMail = mails.splice(index, 1)[0];
    // Return the deleted mail (for now not needed but used to verify not null)
    return deletedMail;
}

// Function to update a mail by its ID.
const updateMailById = (id, new_receivers_emails, new_subject, new_body) => {
    // Find index of mail in array
    const index = mails.findIndex(cur_mail => cur_mail.id === id);
    // If mail not found, return null
    if (index === -1) {
        return null;
    }
    // Update mail subject and body
   mails[index].receivers_emails = new_receivers_emails.map(email => email.toLowerCase());
    mails[index].subject = new_subject || "";
    mails[index].body = new_body || "";
    mails[index].created_at = new Date().toISOString(); // updated timestamp

    // Return the updated mail
    return mails[index];
}

// Function to search mails by query
const searchMails = (user_id, query) => {
    // Normalize query to lowercase
    const normalizedQuery = query.toLowerCase();
    // Filter mails by user_id and search query
    return mails.filter(mail => 
        mail.user_id === user_id && 
        (mail.subject.toLowerCase().includes(normalizedQuery) || 
         mail.body.toLowerCase().includes(normalizedQuery) || 
         mail.sender_email.toLowerCase().includes(normalizedQuery) ||
         mail.receivers_emails.some(email => email.toLowerCase().includes(normalizedQuery)))
    );
}

module.exports = {
    createMail,
    getMailsByUser,
    getMailById,
    deleteMailById,
    updateMailById,
    searchMails
}
