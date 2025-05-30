// Note: At end of file there are running input examples for testing the API.
// Note: Using "id": "xxx" as label_id as in task example. So "user_id" is in use for user_id.
// Import models
const Mails = require('../models/mails')
const Users = require('../models/users')
const Blacklist = require('../models/blacklist')

const MAX_CONTENT_SIZE = 10 * 1024 * 1024; // 10MB
const urlPattern = /\b((https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([a-zA-Z0-9\-._~:/?#@!$&'()*+,;=%]*)?)\b/g;


exports.createMail = async (req, res) => {
  const sender_id = parseInt(req.headers.user_id) || null;
  const { receivers_emails, subject, content } = req.body;

  if (!sender_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  if (!subject && !content) {
    return res.status(400).json({ error: 'Subject or content are required' });
  }

  if (subject) {
    if (subject.length > 1024) {
      return res.status(400).json({ error: 'Subject must be between 1 and 1024 characters' });
    }
    if (subject.includes('\n') || subject.includes('\r')) {
      return res.status(400).json({ error: 'Subject must be in one line' });
    }
  }

  if (content.length > MAX_CONTENT_SIZE) {
    return res.status(400).json({ error: 'Content must be between 1 byte and 10MB' });
  }

  const combinedText = subject + "\n" + content;
  const foundUrls = [...new Set(combinedText.match(urlPattern) || [])];
  console.log("Found URLs:", foundUrls);
  // For each url in array, check if blacklisted
  for (const url of foundUrls) {
    const { error, blacklisted } = await Blacklist.checkUrl(url);
    if (error) {
      return res.status(500).json({ error: 'Internal server error while checking URLs' });
    }
    if (blacklisted) {
      return res.status(400).json({
        error: 'Email contains blacklisted URL',
        blacklisted: url
      });
    }
  }
    // Continue only if no blacklist errors

    if (!receivers_emails || !Array.isArray(receivers_emails) || receivers_emails.length === 0) {
      return res.status(400).json({ error: 'Receiver emails are required and must be an array' });
    }

    const user = Users.getUser(sender_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user_email = user.email.toLowerCase();

    const invalidEmails = [];
    const receivers = [];

    for (const email of receivers_emails) {
      const receiver = Users.getUserByEmail(email);
      if (!receiver) {
        invalidEmails.push(email);
      } else {
        receivers.push(receiver.id);
      }
    }

    if (invalidEmails.length > 0) {
      return res.status(400).json({ error: 'Invalid receiver emails', invalidEmails });
    }

    const createdMailIds = [];

    for (const receiverId of receivers) {
      const newMail = Mails.createMail(
        receiverId,
        user_email,
        receivers_emails,
        subject,
        content,
        false // is_opened is false for receiver side
        );
      createdMailIds.push(newMail.id);
    }

    const newMailSenderSide = Mails.createMail(
        sender_id,
        user_email,
        receivers_emails,
        subject,
        content,
        true
        );


    if (!newMailSenderSide) {
      return res.status(500).json({ error: 'Failed to create mail' });
    }

    res.status(201).location(`/api/mails/${newMailSenderSide.id}`).end();
};



exports.getMailsByUser = (req, res) => {
    // Assuming user_id is passed in headers
    const user_id = parseInt(req.headers.user_id) || null;

    // Check that user id is provided
    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // Check that user exists
    const user = Users.getUser(user_id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Get mails for the user by array
    const mails = Mails.getMailsByUser(user_id);

    // Return the mails
    res.status(200).json(mails);
};

exports.getMailById = (req, res) => {
    // Assuming user_id is passed in headers, and mail_id is in the URL
    const user_id = parseInt(req.headers.user_id) || null;
    const mail_id = parseInt(req.params.id);

    // Check that user id is provided
    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // Check that user exists
    const user = Users.getUser(user_id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Check that mail_id is provided
    if (!mail_id) {
        return res.status(400).json({ error: 'Mail ID is required' });
    }

    // Get the mail by ID
    const mail = Mails.getMailById(mail_id);
    
    // Check if mail exists
    if (!mail) {
        return res.status(404).json({ error: 'Mail not found' });
    }
    // Check if mail belongs to the user
   if (mail.sender_id !== user_id && !mail.receivers_emails.includes(user.email) ) {
        return res.status(403).json({ error: 'Mail does not belong to the user' });
    }
    // Return the mail
    res.status(200).json(mail);
}

// Update mail by ID
exports.updateMailById = async (req, res) => {
  const user_id = parseInt(req.headers.user_id) || null;
  const mail_id = parseInt(req.params.id);

// Check that user id is provided
  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

// Check that user exists
  const user = Users.getUser(user_id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
// Check that mail_id is provided
  if (!mail_id) {
    return res.status(400).json({ error: 'Mail ID is required' });
  }
// Get the mail by ID
  const mail = Mails.getMailById(mail_id);
  if (!mail) {
    return res.status(404).json({ error: 'Mail not found' });
  }

  // Check if mail belongs to the user
   if (mail.sender_id !== user_id && !mail.receivers_emails.includes(user.email) ) {
        return res.status(403).json({ error: 'Mail does not belong to the user' });
    }

  // Check for required fields
  const { receivers_emails, subject, content } = req.body;
  if ((!Array.isArray(receivers_emails) || receivers_emails.length === 0) || !(subject || content)) {
    return res.status(400).json({ error: 'receivers_emails, subject or content are required' });
  }
// Validate receivers_emails
  if (subject && subject.length > 1024) {
    return res.status(400).json({ error: 'Subject must be between 1 and 1024 characters' });
  }

  if (subject && (subject.includes('\n') || subject.includes('\r'))) {
    return res.status(400).json({ error: 'Subject must be in one line' });
  }

  if (content && content.length > MAX_CONTENT_SIZE) {
    return res.status(400).json({ error: 'Content must be between 1 byte and 10MB' });
  }
// Check for URLs in subject and content to check against blacklist
  const combinedText = subject + "\n" + content;
  const foundUrls = [...new Set(combinedText.match(urlPattern) || [])];
  console.log("Found URLs:", foundUrls);
  // For each url in array, check if blacklisted
  for (const url of foundUrls) {
    const { error, blacklisted } = await Blacklist.checkUrl(url);
    if (error) {
      return res.status(500).json({ error: 'Internal server error while checking URLs' });
    }
    if (blacklisted) {
      return res.status(400).json({
        error: 'Email contains blacklisted URL',
        blacklisted: url
      });
    }
  }

    // Continue only if URL check passed
// Validate receivers_emails
    const invalidEmails = [];
    const receivers = [];

    for (const email of receivers_emails) {
      const receiver = Users.getUserByEmail(email);
      if (!receiver) {
        invalidEmails.push(email);
      } else {
        receivers.push(receiver.id); // collect valid ones
      }
    }

    if (invalidEmails.length > 0) {
      return res.status(400).json({ error: 'Invalid receiver emails', invalidEmails });
    }

    //  Finally update the mail
    const updatedMail = Mails.updateMailById(mail_id, receivers_emails, subject, content);

    if (!updatedMail) {
      return res.status(404).json({ error: 'Mail not found or update failed' });
    }

    return res.status(204).end();
  };



exports.deleteMailById = (req, res) => {
    // Assuming user_id is passed in headers, and mail_id is in the URL
    const user_id = parseInt(req.headers.user_id) || null;
    const mail_id = parseInt(req.params.id);

    // Check that user id is provided
    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // Check that user exists
    const user = Users.getUser(user_id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Check that mail_id is provided
    if (!mail_id) {
        return res.status(400).json({ error: 'Mail ID is required' });
    }

    // Get the mail by ID
    const mail = Mails.getMailById(mail_id);
    
    // Check if mail exists
    if (!mail) {
        return res.status(404).json({ error: 'Mail not found' });
    }

  // Check if mail belongs to the user
    if (mail.sender_id !== user_id && !mail.receivers_emails.includes(user.email) ) {
        return res.status(403).json({ error: 'Mail does not belong to the user' });
    }

    // Delete the mail
    Mails.deleteMailById(mail_id);
    // Return success response
    res.status(204).end(); // No content response for successful deletion
}

// Search mails by query
exports.searchMails = (req, res) => {
    const user_id = parseInt(req.headers.user_id) || null;
    const query = req.params.query || '';  // <-- FIXED this line

    // Check that user id is provided
    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // Check that user exists
    const user = Users.getUser(user_id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    // Check that query is provided
    if (!query || query.trim() === '') {
        return res.status(400).json({ error: 'Query is required' });
    }

    // Get mails for the user by array
    const filteredMails = Mails.searchMails(user_id, query);


    // Return the filtered mails
    res.status(200).json(filteredMails);
};




/*
1)Create user: (invalid eliran updated - for now works)
curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Alice",
    "last_name": "Smith",
    "birthDay": "1999-05-15",
    "gender": "female",
    "email": "alice.smith@example.com",
    "password": "SecurePass123!",
    "phone_number": "0523456789"
  }'


2)Create another user:
curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Bob",
    "last_name": "Bob",
    "birthDay": "1999-05-15",
    "gender": "female",
    "email": "bob@example.com",
    "password": "SecurePass123%",
    "phone_number": "0523456789"
  }'

3)Create another user:
curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Eliran",
    "last_name": "Eliran",
    "birthDay": "1999-05-15",
    "gender": "female",
    "email": "FFT@example.com",
    "password": "SecurePass123%",
    "phone_number": "0523456789"
  }'

4) Create mail for user:
curl -i -X POST http://localhost:3000/api/mails \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "receivers_emails": ["bob@example.com"],
    "subject": "Hello Bob",
    "content": "This is a test email for Bob."
  }'


5) Create another mail for user:
curl -i -X POST http://localhost:3000/api/mails \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "receivers_emails": ["alice.smith@example.com", "FFT@example.com"],
    "subject": "Hello Alice",
    "content": "This is a test email for Alice."
  }'

6) Get mails for user:
curl -i -X GET http://localhost:3000/api/mails \
  -H "user_id: 1"
7) Get mail by ID:
curl -i -X GET http://localhost:3000/api/mails/3 \
  -H "user_id: 1"
8) Update mail by ID:
curl -i -X PATCH http://localhost:3000/api/mails/5 \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "receivers_emails": ["bob@example.com"],
    "subject": "Updated Subject"
}'
9) Bad mails request (invalid user_id):
curl -i -X GET http://localhost:3000/api/mails \
  -H "user_id: 5"

// 10) Delete mail by ID:
curl -i -X DELETE http://localhost:3000/api/mails/3 \
  -H "user_id: 1"
11) Bad send mail request (invalid user_id):
curl -i -X POST http://localhost:3000/api/mails \
-H "Content-Type: application/json" \
-H "user_id: 5" \
  -d '{
    "receivers_emails": ["bob@example.com"],
    "subject": "Hello Bob",
    "content": "This is a test email for Bob."
}'
// 12) Bad send mail request (empty receiver email):
curl -i -X POST http://localhost:3000/api/mails \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "receivers_emails": [""],
    "subject": "Hello Bob",
    "content": "This is a test email for Bob."
  }'
// 13) Bad send mail request (invalid subject):
curl -i -X POST http://localhost:3000/api/mails \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{  
    "receivers_emails": ["bob@example.com"]
}'
// 14) Bad send mail request (invalid content):
curl -i -X POST http://localhost:3000/api/mails \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "receivers_emails": ["noEmail@example.com"],
    "subject": "Hello Bob",
    "content": "This is a test email for Bob."
  }'
  15) Loop that creates a mail with a 51 times
  for i in {1..51}; do
  curl -i -X POST http://localhost:3000/api/mails \
    -H "Content-Type: application/json" \
    -H "user_id: 1" \
    -d '{"receivers_emails": ["bob@example.com"], "subject": "Hello Bob", "content": "This is a test email for Bob."}'
done
16) Check how many mails return for user: - should be 50
curl -s -X GET http://localhost:3000/api/mails \
  -H "user_id: 1" | jq length
  17)create a bad url to blacklist
curl -i -X POST http://localhost:3000/api/blacklist \
-H "Content-Type: application/json" \
-d '{
  "id": "www.example.com"
}'
// 18) Check if the url is blacklisted
curl -i -X POST http://localhost:3000/api/mails \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "receivers_emails": ["bob@example.com"],
    "subject": "Hello Bob",
    "content": "This is a test email for Bob. Visit www.example.com for more info."
  }'


// 19) Check if the url is blacklisted - one link is blacklist and the other is not - should be blocked
  curl -i -X POST http://localhost:3000/api/mails \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "receivers_emails": ["bob@example.com"],
    "subject": "Hello Bob",
    "content": "This is a test email for Bob. Visit www.example.com www.example2.com for more info."
  }'

// 20) Check if the url is blacklisted - a link that is not blacklisted
  curl -i -X POST http://localhost:3000/api/mails \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "receivers_emails": ["bob@example.com"],
    "subject": "Hello Bob",
    "content": "This is a test email for Bob. Visit www.example3.com for more info."
  }'

// No blacklisted (no www.example.com in content)
    curl -i -X POST http://localhost:3000/api/mails \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "receivers_emails": ["bob@example.com"],
    "subject": "Hello Bob",
    "content": "This is a test email for www.example4.com Bob. www.example8.com www.example11.com    Visit www.example2.com  for more infoya ya ya. www.example5.com "
  }'

  // With blacklisted URL
  curl -i -X POST http://localhost:3000/api/mails \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "receivers_emails": ["bob@example.com"],
    "subject": "Hello Bob",
    "content": "This is a test email ya ya ya www.example.com for www.example4.com Bob. www.example8.com www.example11.com    Visit www.example2.com  for more infoya ya ya. www.example5.com "
  }'

// 21) Search mails by query- Search by subject with whitespace
curl -i -X GET http://localhost:3000/api/mails/search/Hello%20Bob \
  -H "user_id: 1"

// 22) Search mails by query - Search by content
curl -i -X GET http://localhost:3000/api/mails/search/bye \
  -H "user_id: 1"
  
// 23) Search mails by query - Search by sender email
curl -i -X GET http://localhost:3000/api/mails/search/alice \
  -H "user_id: 3"
// 24) Search mails by query - Search by receiver email
curl -i -X GET http://localhost:3000/api/mails/search/eliran \
  -H "user_id: 1"
// 25) Search mails by query - Search by non-existing query
curl -i -X GET http://localhost:3000/api/mails/search/nonexisting \
  -H "user_id: 1"
// 26) Search mails by query - Search by empty query
curl -i -X GET http://localhost:3000/api/mails/search/ \
  -H "user_id: 1"
  
*/

