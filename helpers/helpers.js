const db = require('../data/db-config'); // Assuming you have a Knex configuration file

// Define the TokenBlacklist model
const TokenBlacklist = {
  create: async function ({ token }) {
    try {
      await db('token_blacklist').insert({ token: token });
    } catch (error) {
      console.error('Error adding token to the blacklist:', error);
      throw new Error('Unable to add token to the blacklist');
    }
  },
};



module.exports = TokenBlacklist;