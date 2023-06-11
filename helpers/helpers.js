const db = require('../data/db-config'); 

const TokenBlacklist = {
  create: async function ({ token }) {
    try {
      await db('token_blacklist').insert({ token: token });
    } catch (error) {
      console.error('Error adding token to the blacklist:', error);
      throw new Error('Unable to add token to the blacklist');
    }
  },
  exists: async function (token) {
    try {
      const result = await db('token_blacklist').where({ token: token }).first();
      return !!result;
    } catch (error) {
      console.error('Error checking if token exists in the blacklist:', error);
      throw new Error('Unable to check if token exists in the blacklist');
    }
  },
};



module.exports = TokenBlacklist;