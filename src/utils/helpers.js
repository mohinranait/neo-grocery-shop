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

module.exports = {
    generateSlug
}