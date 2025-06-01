// Note: At end of file there are running input examples for testing the API.
// Note: Using "id": "xxx" as label_id as in task example. So "user_id" is in use for user_id.
// Import models
const Labels = require('../models/labels')
const Users = require('../models/users')

exports.createLabel = (req, res) => {
    // Assuming req.body contain name, and req.headers contain user_id
    const user_id = parseInt(req.headers.user_id) || null; 
    const { name } = req.body

    // Check for required fields
    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' })
    }
    if (!name) {
        return res.status(400).json({ error: 'Name is required' })
    }

    // Assures that user exists
    const user = Users.getUser(parseInt(user_id))
    if (!user) {
        return res.status(404).json({ error: 'User not found' })
    }

    // Check that name is between 1 and 225 (include) characters
    if (name.length < 1 || name.length > 225) {
        return res.status(400).json({ error: 'Label name must be between 1 and 225 characters' })
    }

    // Check if label already exists
    const existingLabel = Labels.getLabelByName(name);
    if (existingLabel) {
        return res.status(400).json({ error: 'Label already exists' })
    }
    // Create the label
    const newLabel = Labels.createLabel(name , user_id)
    // Return success response
    res.status(201).location(`/api/labels/${newLabel.id}`).end()
}

exports.getLabelsByUser = (req, res) => {
    // Assuming user_id is passed in headers
    const user_id = parseInt(req.headers.user_id) || null;

    // Check that user id is provided
    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' })
    }
    // Check that user exists
    const user = Users.getUser(user_id)
    if (!user) {
        return res.status(404).json({ error: 'User not found' })
    }
    // Get labels for the user by array
    const labels = Labels.getLabelsByUser(user_id)

    // Silence the user_id for each label
    silenced_labels = [];
    labels.forEach(label => {
        const { user_id: _user_id, ...labelWithoutUserId } = label;
        silenced_labels.push(labelWithoutUserId);
    });

    // Return the labels
    res.json(silenced_labels) // Default response is 200 OK
}


exports.getLabelById = (req, res) => {
    // Assuming user_id is passed in headers, and label_id is in the URL
    const user_id = parseInt(req.headers.user_id) || null;
    const label_id = parseInt(req.params.id);

    // Check that user id is provided
    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' })
    }
    // Check that user exists
    const user = Users.getUser(user_id)
    if (!user) {
        return res.status(404).json({ error: 'User not found' })
    }
    // Check that label_id is provided
    if (!label_id) {
        return res.status(400).json({ error: 'Label ID is required' })
    }
    // Get the label by ID
    const label = Labels.getLabelById(label_id);
    // Check if label exists
    if (!label) {
        return res.status(404).json({ error: 'Label not found' })
    }
    // Check if label belongs to the user
    if (label.user_id !== user_id) {
        return res.status(403).json({ error: 'Label does not belong to the user' })
    }
    // If label and user are valid and match, return the label
    // Silence the user_id for the response
    // Syntax assign user_id to trash, and the rest good into labelWithout
    const { user_id: _user_id, ...labelWithoutUserId } = label;
    res.json(labelWithoutUserId); // Default response is 200 OK
}

exports.deleteLabelById = (req, res) => {
    // Assuming user_id is passed in headers, and label_id is in the URL
    const user_id = parseInt(req.headers.user_id) || null;
    const label_id = parseInt(req.params.id);

    // Check that user id is provided
    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' })
    }
    // Check that user exists
    const user = Users.getUser(user_id)
    if (!user) {
        return res.status(404).json({ error: 'User not found' })
    }
    // Check that label_id is provided
    if (!label_id) {
        return res.status(400).json({ error: 'Label ID is required' })
    }
    // Get the label by ID
    const label = Labels.getLabelById(label_id);
    // Check if label exists
    if (!label) {
        return res.status(404).json({ error: 'Label not found' })
    }
    // Check if label belongs to the user
    if (label.user_id !== user_id) {
        return res.status(403).json({ error: 'Label does not belong to the user' })
    }
    
    // If label and user are valid and match, delete the label
    const deletedLabel = Labels.deleteLabelById(label_id);

    // Check if delete was successful
    if (!deletedLabel) { // If null has returned (should not happen at all)
        return res.status(404).json({ error: 'Label not found' })
    }
    res.status(204).end() // No content response for successful deletion
}

exports.updateLabelById = (req, res) => {
    // Assuming: user_id-->headers, label_id-->URL, new_name-->body
    const user_id = parseInt(req.headers.user_id) || null;
    const label_id = parseInt(req.params.id);
    const { name } = req.body;

    // Check that user id is provided
    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' })
    }
    // Check that user exists
    const user = Users.getUser(user_id)
    if (!user) {
        return res.status(404).json({ error: 'User not found' })
    }

    // Check that label_id is provided
    if (!label_id) {
        return res.status(400).json({ error: 'Label ID is required' })
    }

    // Check that name is provided
    if (!name) {
        return res.status(400).json({ error: 'Name is required' })
    }
    // Check that name is between 1 and 225 (include) characters
    if (name.length < 1 || name.length > 225) {
        return res.status(400).json({ error: 'Label name must be between 1 and 225 characters' })
    }

    // Get the label by ID
    const label = Labels.getLabelById(label_id);
    // Check if label exists
    if (!label) {
        return res.status(404).json({ error: 'Label not found' })
    }

    // Check if label belongs to the user
    if (label.user_id !== user_id) {
        return res.status(403).json({ error: 'Label does not belong to the user' })
    }

    // Update the label's name
    updated_label = Labels.updateLabelById(label_id, name);

    // Check if update was successful
    if (!updated_label) { // If null has returned (should not happen at all!)
        return res.status(404).json({ error: 'Label not found' })
    }
    // Return success response with updated label
    res.status(204).end() // No content response for successful update (no need to pass json)
}


/*
1)Create user:
curl -i -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{
  "first_name": "Alice",
  "last_name": "Smith",
  "email": "alice.smith@example.com",
  "password": "SecurePass123",
  "birthDay": "1999-05-15",
  "phone_number": "0523456789"
}'
2) Create label for user:
curl -i -X POST http://localhost:3000/api/labels \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "name": "urgent"
  }'

  curl -i -X POST http://localhost:3000/api/labels \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "name": "urgentfft"
  }'

  3) Get labels for user:
curl -i -X GET http://localhost:3000/api/labels \
  -H "user_id: 1"

  4) Get label by ID:
  curl -i -X GET http://localhost:3000/api/labels/2 \
  -H "user_id: 1"

  5) Update label by ID:
  curl -i -X PATCH http://localhost:3000/api/labels/2 \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{ "name": "high-priority" }'

  Check it worked:
  curl -i -X GET http://localhost:3000/api/labels/2 \
  -H "Content-Type: application/json" \
  -H "user_id: 1"

6) Delete label by ID:
curl -i -X DELETE http://localhost:3000/api/labels/2 \
  -H "user_id: 1"

*/