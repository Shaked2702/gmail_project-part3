// File of model for labels

// Set a unique counter id for each user.
let idCounter = 0
// Set an array to store the labels.
const labels = []

// Function to get label object by it's Name (if exists).
const getLabelByName = (name) =>
    labels.find(cur_label => cur_label.name === name);

// Function to create a new label.
const createLabel = (name, user_id) => {
    const newLabel = {
        id: ++idCounter,
        name,
        user_id // Ensure user_id is an integer
    }
    labels.push(newLabel)
    return newLabel
}

const getLabelsByUser = (user_id) => {
    // Filter labels by user_id
    return labels.filter(cur_label => cur_label.user_id === user_id); 
    // Creates a new array on spot and returns directly
}

const getLabelById = (id) => {
    // Find label by id
    return labels.find(cur_label => cur_label.id === id);
}

const deleteLabelById = (id) => {
    // Find index of label in labels array
    const index = labels.findIndex(cur_label => cur_label.id === id);
    // If label not found, return null
    if (index === -1) {
        return null;
    }
    // Remove label from array
    const deletedLabel = labels.splice(index, 1)[0];
    // Return the deleted label (for now not needed but used to verify not null)
    return deletedLabel;
}

const updateLabelById = (id, new_name) => {
    // Find index of label in array
    const index = labels.findIndex(cur_label => cur_label.id === id);
    // If label not found, return null
    if (index === -1) {
        return null;
    }

    // Update label name
    labels[index].name = new_name;

    // Return the updated label (not needed at the moment, but in use to verify not null)
    return labels[index];
}


module.exports = {
    getLabelByName,
    createLabel,
    getLabelsByUser,
    getLabelById,
    deleteLabelById,
    updateLabelById
}