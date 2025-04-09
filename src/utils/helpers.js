const bcrypt = require('bcryptjs');


/**
 * Generates a slug from a given string.
 * @param text - The input string to generate a slug from.
 * @returns A URL-friendly slug string.
 */
const  generateSlug = (text) => {
    return text
      .toLowerCase() 
      .trim() 
      .replace(/[^a-z0-9\s-]/g, '') 
      .replace(/\s+/g, '-') 
      .replace(/-+/g, '-'); 
}


/**
 * Generate password hash using bcrypt.
 * @param password - The plain text password to hash.
 * @returns A promise that resolves to the hashed password.
*/
const generatePasswordHash = async (password) => {
    const salt = await bcrypt.genSalt(10); 
    const hash = await bcrypt.hash(password, salt); 
    return hash; 
}



module.exports = {
    generateSlug,
    generatePasswordHash
}