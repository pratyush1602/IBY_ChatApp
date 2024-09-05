

const USER = require("../modles/USER");
const { onlineuser } = require('../socket'); // Assuming onlineuser set is exported from socket.js

async function searched(request, response) {
  try {
    const { search } = request.body;
    const query = new RegExp(search, 'i');
    
    // Fetch users matching the search query
    const users = await USER.find({
      "$or": [{ name: query }]
    }).select("-password");
    
    // Map users with online status
    const usersWithStatus = users.map(user => ({
      ...user.toObject(), // Convert the Mongoose document to a plain object
      isOnline: onlineuser.has(user._id.toString()) // Check if the user is online
    }));

    // Sort users: online users first
    usersWithStatus.sort((a, b) => {
      return b.isOnline - a.isOnline; // Sort so that true (1) comes before false (0)
    });

    return response.json({
      message: 'all users',
      data: usersWithStatus,
      success: true
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true
    });
  }
}

module.exports = searched;
