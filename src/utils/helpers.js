/**
 * Generates a slug from a given string.
 * @param name - The input string to generate a slug from.
 * @returns A URL-friendly slug string.
 */
const  generateSlug = (name) => {
    return name
      .toLowerCase() 
      .trim() 
      .replace(/[^a-z0-9\s-]/g, '') 
      .replace(/\s+/g, '-') 
      .replace(/-+/g, '-'); 
}

module.exports = {
    generateSlug
}